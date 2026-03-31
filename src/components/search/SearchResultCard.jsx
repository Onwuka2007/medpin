import { useEffect, useState } from "react"
import { Expand, MapPin, X } from "lucide-react"

function getStatusLabel(status) {
  if (status === "low_stock") {
    return "Low stock"
  }

  return "In stock"
}

function getStatusClasses(status) {
  if (status === "low_stock") {
    return "bg-[#fff4de] text-[#9c6500]"
  }

  return "bg-[#e8f5ee] text-[#1f5649]"
}

function getMapPointStyle(pharmacy) {
  const left = `${42 + (pharmacy.coordinates.lng % 0.1) * 220}%`
  const top = `${38 + (pharmacy.coordinates.lat % 0.1) * 220}%`

  return { left, top }
}

function PharmacyMapCanvas({
  inventoryResults,
  topPharmacy,
  expanded = false,
  onExpand,
  onClose,
}) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[rgba(31,86,73,0.08)] bg-white sm:rounded-[1.5rem]">
      <div className="flex items-start justify-between gap-3 px-3.5 pb-2 pt-3.5 sm:px-4 sm:pt-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
            Pharmacy map
          </p>
          <p className="mt-1 text-xs leading-5 text-[#5f7b71] sm:text-sm">
            {topPharmacy.pharmacy.address}
          </p>
        </div>

        {expanded ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(31,86,73,0.08)] bg-white px-2.5 py-2 text-[11px] font-semibold text-[var(--color-primary)] sm:gap-2 sm:px-3 sm:text-xs"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        ) : (
          <button
            type="button"
            onClick={onExpand}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(31,86,73,0.08)] bg-[#f7fbf8] px-2.5 py-2 text-[11px] font-semibold text-[var(--color-primary)] sm:gap-2 sm:px-3 sm:text-xs"
          >
            <Expand className="h-3.5 w-3.5" />
            Expand map
          </button>
        )}
      </div>

      <div
        className={`relative overflow-hidden bg-[linear-gradient(180deg,#eef6f2_0%,#e4f0ea_100%)] ${
          expanded ? "h-[calc(100vh-8rem)] min-h-[28rem]" : "h-56 sm:h-72"
        }`}
      >
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.65)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute left-[10%] top-[18%] h-28 w-28 rounded-full border border-white/60" />
          <div className="absolute right-[8%] top-[22%] h-22 w-22 rounded-full border border-white/60" />
          <div className="absolute left-[18%] top-[52%] h-16 w-[58%] rounded-full border border-white/70" />
          <div className="absolute left-[28%] top-[30%] h-[46%] w-[12%] rounded-full bg-white/35 blur-[2px]" />
        </div>

        {inventoryResults.slice(0, 4).map((item, index) => (
          <div
            key={item.inventoryId}
            className="absolute"
            style={getMapPointStyle(item.pharmacy)}
          >
            <div
              className={`relative flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                index === 0
                  ? "border-[#173f36] bg-[#d7ff2f] text-[#173f36]"
                  : "border-white bg-[var(--color-primary)] text-white"
              } shadow-[0_14px_30px_rgba(31,86,73,0.18)]`}
            >
              <MapPin className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
          </div>
        ))}

        <div className="absolute inset-x-3 bottom-3 rounded-[1rem] bg-white/92 px-3 py-3 backdrop-blur-md shadow-[0_14px_30px_rgba(31,86,73,0.12)] sm:inset-x-4 sm:bottom-4 sm:rounded-[1.1rem]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                {topPharmacy.pharmacy.name}
              </p>
              <p className="mt-1 text-xs text-[#6f897f]">
                {topPharmacy.pharmacy.landmark}
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-secondary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-primary)]">
              {topPharmacy.distanceKm} km
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultCard({ result }) {
  const { drug, inventoryResults, alternatives } = result
  const topPharmacy = inventoryResults[0]
  const [mapOverlayOpen, setMapOverlayOpen] = useState(false)

  useEffect(() => {
    if (!mapOverlayOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mapOverlayOpen])

  return (
    <>
      <article className="overflow-hidden rounded-[1.65rem] border border-[rgba(31,86,73,0.08)] bg-white p-3.5 shadow-[0_20px_50px_rgba(31,86,73,0.08)] sm:rounded-[2rem] sm:p-5">
        <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,#f8fcf9_0%,#f2f8f4_100%)] p-4 sm:rounded-[1.65rem]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[1.1rem] font-semibold tracking-[-0.04em] text-[var(--color-foreground)] sm:text-[1.45rem]">
                  {drug.name}
                </h2>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)] shadow-[0_8px_18px_rgba(31,86,73,0.06)]">
                  {drug.form}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-[#648277] sm:text-sm">
                {drug.genericName} • {drug.strength}
              </p>
            </div>

            <div className="rounded-[1rem] border border-[rgba(31,86,73,0.08)] bg-white px-2.5 py-2 text-right shadow-[0_10px_24px_rgba(31,86,73,0.05)] sm:rounded-[1.1rem] sm:px-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#799188]">
                Nearby
              </p>
              <p className="mt-1 text-base font-semibold tracking-[-0.04em] text-[var(--color-primary)] sm:text-lg">
                {inventoryResults.length}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-6 text-[#58756b] sm:text-sm">
            {drug.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#56746a] shadow-[0_8px_18px_rgba(31,86,73,0.05)]">
              {drug.category}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#56746a] shadow-[0_8px_18px_rgba(31,86,73,0.05)]">
              {drug.requiresPrescription
                ? "Prescription likely needed"
                : "OTC in many pharmacies"}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {topPharmacy ? (
            <>
              <div className="rounded-[1.35rem] border border-[rgba(31,86,73,0.08)] bg-white p-3.5 sm:rounded-[1.5rem] sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                      Best nearby option
                    </p>
                    <h3 className="mt-2 text-[15px] font-semibold text-[var(--color-foreground)] sm:text-base">
                      {topPharmacy.pharmacy.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#5f7b71] sm:text-sm">
                      {topPharmacy.pharmacy.area}, {topPharmacy.pharmacy.city} •{" "}
                      {topPharmacy.distanceKm} km away
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(topPharmacy.status)}`}
                  >
                    {getStatusLabel(topPharmacy.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-[0.95rem] bg-[#f7fbf8] px-3 py-3 sm:rounded-[1rem]">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                      {topPharmacy.priceLabel ?? "On request"}
                    </p>
                  </div>
                  <div className="rounded-[0.95rem] bg-[#f7fbf8] px-3 py-3 sm:rounded-[1rem]">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                      ETA
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-foreground)]">
                      {topPharmacy.etaMinutes} mins
                    </p>
                  </div>
                  <div className="rounded-[0.95rem] bg-[#f7fbf8] px-3 py-3 sm:rounded-[1rem]">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-foreground)]">
                      {topPharmacy.pharmacy.openNow ? "Open now" : "Closed"}
                    </p>
                  </div>
                </div>
              </div>

              <PharmacyMapCanvas
                inventoryResults={inventoryResults}
                topPharmacy={topPharmacy}
                onExpand={() => setMapOverlayOpen(true)}
              />
            </>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--color-border)] bg-[#fbfdfb] px-4 py-5 text-sm text-[#648277] sm:rounded-[1.5rem]">
              No partner pharmacy inventory found for this drug yet.
            </div>
          )}

          {inventoryResults.length > 1 && (
            <div className="rounded-[1.35rem] border border-[rgba(31,86,73,0.08)] bg-[#fbfdfb] p-3.5 sm:rounded-[1.5rem] sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                More pharmacies
              </p>
              <div className="mt-3 space-y-2">
                {inventoryResults.slice(1, 4).map((item) => (
                  <div
                    key={item.inventoryId}
                    className="flex items-center justify-between gap-3 rounded-[1rem] bg-white px-3 py-3 sm:rounded-[1.1rem]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                        {item.pharmacy.name}
                      </p>
                      <p className="mt-1 text-xs text-[#769087]">
                        {item.distanceKm} km away • {item.etaMinutes} mins
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-primary)]">
                      {item.priceLabel ?? "On request"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {drug.brandNames.length > 0 && (
            <div className="rounded-[1.35rem] border border-[rgba(31,86,73,0.08)] bg-[#fbfdfb] p-3.5 sm:rounded-[1.5rem] sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                Brands
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {drug.brandNames.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full border border-[rgba(31,86,73,0.08)] bg-white px-3 py-1.5 text-xs text-[#5d796f]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="rounded-[1.35rem] border border-[rgba(31,86,73,0.08)] bg-[#fffdf8] p-3.5 sm:rounded-[1.5rem] sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b815b]">
                Alternatives to ask about
              </p>
              <div className="mt-3 space-y-2">
                {alternatives.map((alternative) => (
                  <div
                    key={alternative.id}
                    className="rounded-[1rem] border border-[rgba(31,86,73,0.08)] bg-white px-3 py-3 sm:rounded-[1.1rem]"
                  >
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {alternative.name}
                    </p>
                    <p className="mt-1 text-xs text-[#648277]">
                      {alternative.genericName} • {alternative.strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {mapOverlayOpen && topPharmacy && (
        <div className="fixed inset-0 z-[120] bg-[rgba(16,42,35,0.18)] backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close expanded map"
            onClick={() => setMapOverlayOpen(false)}
            className="absolute inset-0"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] rounded-t-[1.8rem] bg-[#f8fbf8] shadow-[0_-24px_60px_rgba(31,86,73,0.18)] sm:rounded-t-[2rem]">
            <div className="flex justify-center px-4 pt-3">
              <span className="h-1.5 w-16 rounded-full bg-[#c9d9d1]" />
            </div>

            <div className="hide-scrollbar max-h-[calc(92vh-1rem)] overflow-y-auto px-3 pb-5 pt-3 sm:px-8 sm:pb-6 sm:pt-4 lg:px-10">
              <div className="mx-auto max-w-5xl">
                <PharmacyMapCanvas
                  inventoryResults={inventoryResults}
                  topPharmacy={topPharmacy}
                  expanded
                  onClose={() => setMapOverlayOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchResultCard
