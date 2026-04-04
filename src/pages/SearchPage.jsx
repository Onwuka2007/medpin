import { useMemo } from "react"
import { MapPinOff } from "lucide-react"
import { useLocation, useSearchParams } from "react-router-dom"
import SearchResultCard from "../components/search/SearchResultCard.jsx"
import { loadStoredUserLocation } from "../lib/searchStorage.js"
import { searchMockData } from "../services/searchService.js"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const query = searchParams.get("q") ?? ""
  const userLocation =
    location.state?.userLocation ?? loadStoredUserLocation()

  const searchResult = useMemo(
    () => searchMockData(query, userLocation),
    [query, userLocation],
  )

  const activeResult = searchResult.drugResults[0] ?? null

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {!userLocation ? (
        <section className="px-4 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl rounded-[1.65rem] border border-[#f0dede] bg-white px-5 py-10 text-center shadow-[0_18px_50px_rgba(31,86,73,0.04)] sm:rounded-[2rem] sm:px-6 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7f7] text-[#9b4b4b]">
              <MapPinOff className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-(--color-foreground) sm:text-xl">
              Location is required
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#648277]">
              Turn on location access from the home search to find pharmacies near
              you, or run a new search so we can save your location in this
              browser.
            </p>
          </div>
        </section>
      ) : activeResult ? (
        <SearchResultCard result={activeResult} userLocation={userLocation} />
      ) : (
        <section className="px-4 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl rounded-[1.65rem] border border-dashed border-(--color-border) bg-white px-5 py-10 text-center shadow-[0_18px_50px_rgba(31,86,73,0.04)] sm:rounded-[2rem] sm:px-6 sm:py-12">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-(--color-foreground) sm:text-xl">
              No results nearby yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#648277]">
              No partner pharmacy near your current location is stocking that
              drug.
            </p>
          </div>
        </section>
      )}
    </main>
  )
}
