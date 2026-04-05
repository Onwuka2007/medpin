import { mockDrugs, mockInventory, mockPharmacies } from "../data/mock/index.js"
import { getDistanceKm } from "../lib/distance.js"

function normalize(value) {
  return value.trim().toLowerCase()
}

function formatCurrency(amount, currency = "NGN") {
  if (amount == null) {
    return null
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function drugMatchesCanonicalAlias(drug, queryNorm) {
  if (normalize(drug.name) === queryNorm) return true
  if (normalize(drug.genericName) === queryNorm) return true
  if (drug.brandNames?.some((b) => normalize(b) === queryNorm)) return true
  if (drug.synonyms?.some((s) => normalize(s) === queryNorm)) return true
  return false
}

function scoreDrugMatch(drug, query) {
  const fields = [
    drug.name,
    drug.genericName,
    ...(drug.brandNames ?? []),
    ...(drug.synonyms ?? []),
    ...(drug.commonMisspellings ?? []),
    ...(drug.tags ?? []),
    drug.category,
  ].filter(Boolean)

  let score = 0

  for (const field of fields) {
    const normalizedField = normalize(field)

    if (normalizedField === query) {
      score = Math.max(score, 100)
    } else if (normalizedField.startsWith(query)) {
      score = Math.max(score, 75)
    } else if (normalizedField.includes(query)) {
      score = Math.max(score, 55)
    }
  }

  return score
}

export function getDrugById(drugId) {
  return mockDrugs.find((drug) => drug.id === drugId)
}

function getPharmacyById(pharmacyId) {
  return mockPharmacies.find((pharmacy) => pharmacy.id === pharmacyId)
}

function buildInventoryResults(drugId, userLocation = null) {
  return mockInventory
    .filter(
      (item) => item.drugId === drugId && item.status !== "out_of_stock",
    )
    .map((item) => {
      const pharmacy = getPharmacyById(item.pharmacyId)

      if (!pharmacy) {
        return null
      }

      return {
        inventoryId: item.id,
        status: item.status,
        quantity: item.quantity,
        packSize: item.packSize,
        priceLabel: formatCurrency(item.unitPrice, item.currency),
        distanceKm: userLocation
          ? Number(getDistanceKm(userLocation, pharmacy.coordinates).toFixed(1))
          : item.distanceKm,
        etaMinutes: item.etaMinutes,
        updatedAt: item.updatedAt,
        pharmacy,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

function buildDrugResult(drug, userLocation = null) {
  const inventoryResults = buildInventoryResults(drug.id, userLocation)

  const closestPharmacyResult = inventoryResults[0] ?? null

  return {
    drug,
    inventoryResults,
    closestPharmacyResult,
    otherPharmacyResults: inventoryResults.slice(1),
    mapPharmacyResults: inventoryResults.map((item, index) => ({
      ...item,
      isClosest: index === 0,
      markerLabel: index === 0 ? "Closest to you" : item.pharmacy.name,
    })),
    alternatives: (drug.alternativeDrugIds ?? [])
      .map(getDrugById)
      .filter((d, i, arr) => arr.findIndex(x => x.id === d.id) === i),
  }
}

const DID_YOU_MEAN_MIN_SCORE = 75

export function getDidYouMeanSuggestion(rawQuery) {
  const query = normalize(rawQuery ?? "")
  if (!query) return null

  let bestDrug = null
  let bestScore = 0

  for (const drug of mockDrugs) {
    const score = scoreDrugMatch(drug, query)
    if (score > bestScore) {
      bestScore = score
      bestDrug = drug
    }
  }

  if (!bestDrug || bestScore < DID_YOU_MEAN_MIN_SCORE) return null
  if (drugMatchesCanonicalAlias(bestDrug, query)) return null

  return {
    suggestedName: bestDrug.name,
    searchQuery: bestDrug.name,
  }
}

export function buildDrugCatalogForAi() {
  return mockDrugs.map((d) => ({
    id: d.id,
    name: d.name,
    genericName: d.genericName,
    brandNames: d.brandNames ?? [],
  }))
}

export function buildResultsFromDrugIds(drugIds, userLocation = null) {
  const seen = new Set()
  const results = []

  for (const id of drugIds) {
    if (!id || seen.has(id)) continue
    const drug = getDrugById(id)
    if (!drug) continue
    seen.add(id)
    results.push(buildDrugResult(drug, userLocation))
  }

  return results
}

/** Deterministic fallback when AI is unavailable or returns no valid ids. */
export function searchDrugsFallback(rawQuery, userLocation = null) {
  const query = normalize(rawQuery ?? "")

  if (!query) {
    return {
      query: "",
      correctedQuery: null,
      relatedQueries: [],
      drugResults: [],
    }
  }

  const fallbackDrugs = mockDrugs
    .map((drug) => ({ drug, score: scoreDrugMatch(drug, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.drug)

  const uniqueDrugs = fallbackDrugs.filter(
    (drug, index, array) =>
      array.findIndex((entry) => entry.id === drug.id) === index,
  )

  return {
    query: rawQuery,
    correctedQuery: null,
    relatedQueries: [],
    drugResults: uniqueDrugs.map((drug) => buildDrugResult(drug, userLocation)),
  }
}