import {
  mockDrugs,
  mockInventory,
  mockPharmacies,
  mockSearchSuggestions,
} from "../data/mock/index.js";

function normalize(value) {
  return value.trim().toLowerCase();
}

function formatCurrency(amount, currency = "NGN") {
  if (amount == null) {
    return null;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
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
  ].filter(Boolean);

  let score = 0;

  for (const field of fields) {
    const normalizedField = normalize(field);

    if (normalizedField === query) {
      score = Math.max(score, 100);
    } else if (normalizedField.startsWith(query)) {
      score = Math.max(score, 75);
    } else if (normalizedField.includes(query)) {
      score = Math.max(score, 55);
    }
  }

  return score;
}

function getDrugById(drugId) {
  return mockDrugs.find((drug) => drug.id === drugId);
}

function getPharmacyById(pharmacyId) {
  return mockPharmacies.find((pharmacy) => pharmacy.id === pharmacyId);
}

function buildInventoryResults(drugId) {
  return mockInventory
    .filter(
      (item) => item.drugId === drugId && item.status !== "out_of_stock",
    )
    .map((item) => {
      const pharmacy = getPharmacyById(item.pharmacyId);

      if (!pharmacy) {
        return null;
      }

      return {
        inventoryId: item.id,
        status: item.status,
        quantity: item.quantity,
        packSize: item.packSize,
        priceLabel: formatCurrency(item.unitPrice, item.currency),
        distanceKm: item.distanceKm,
        etaMinutes: item.etaMinutes,
        updatedAt: item.updatedAt,
        pharmacy,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function buildDrugResult(drug) {
  return {
    drug,
    inventoryResults: buildInventoryResults(drug.id),
    alternatives: (drug.alternativeDrugIds ?? [])
      .map(getDrugById)
      .filter(Boolean),
  };
}

function buildRecommendationReason(suggestionType, drug) {
  if (suggestionType === "typo_correction") {
    return `AI corrected this to ${drug.name}`;
  }

  if (suggestionType === "category_match") {
    return `AI matched this from a broader medicine request`;
  }

  if (suggestionType === "exact_match") {
    return `AI found an exact drug match`;
  }

  return `AI recommends this based on your search`;
}

export function searchMockData(rawQuery) {
  const query = normalize(rawQuery ?? "");

  if (!query) {
    return {
      query: "",
      correctedQuery: null,
      relatedQueries: [],
      drugResults: [],
    };
  }

  const suggestion = mockSearchSuggestions.find(
    (entry) => normalize(entry.query) === query,
  );

  const suggestedDrugs = suggestion
    ? suggestion.matchedDrugIds.map(getDrugById).filter(Boolean)
    : [];

  const fallbackDrugs = mockDrugs
    .map((drug) => ({ drug, score: scoreDrugMatch(drug, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.drug);

  const uniqueDrugs = [...suggestedDrugs, ...fallbackDrugs].filter(
    (drug, index, array) =>
      array.findIndex((entry) => entry.id === drug.id) === index,
  );

  return {
    query: rawQuery,
    correctedQuery: suggestion?.correctedQuery ?? null,
    relatedQueries: suggestion?.relatedQueries ?? [],
    drugResults: uniqueDrugs.map(buildDrugResult),
  };
}

export function getMockSearchRecommendations(rawQuery) {
  const query = normalize(rawQuery ?? "");

  if (!query) {
    return [];
  }

  const matchingSuggestions = mockSearchSuggestions.filter((entry) => {
    const values = [
      entry.query,
      entry.correctedQuery,
      ...(entry.relatedQueries ?? []),
    ].filter(Boolean);

    return values.some((value) => normalize(value).includes(query));
  });

  const suggestedDrugs = matchingSuggestions.flatMap((entry) =>
    entry.matchedDrugIds
      .map((drugId) => {
        const drug = getDrugById(drugId);

        if (!drug) {
          return null;
        }

        return {
          drug,
          suggestionType: entry.suggestionType,
        };
      })
      .filter(Boolean),
  );

  const fallbackDrugs = mockDrugs
    .map((drug) => ({
      drug,
      score: scoreDrugMatch(drug, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      drug: item.drug,
      suggestionType: null,
    }));

  return [...suggestedDrugs, ...fallbackDrugs]
    .filter(
      (item, index, array) =>
        array.findIndex((entry) => entry.drug.id === item.drug.id) === index,
    )
    .slice(0, 5)
    .map((item) => {
      const inventoryResults = buildInventoryResults(item.drug.id);

      return {
        id: item.drug.id,
        query: item.drug.name,
        title: item.drug.name,
        subtitle: `${item.drug.genericName} • ${item.drug.strength}`,
        nearbyCount: inventoryResults.length,
        reason: buildRecommendationReason(item.suggestionType, item.drug),
      };
    });
}
