import { useMemo } from "react"
import { Search, Sparkles } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/hero/Navbar.jsx"
import SearchResultCard from "../components/search/SearchResultCard.jsx"
import { searchMockData } from "../services/searchService.js"

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const searchResult = useMemo(() => searchMockData(query), [query])
  const displayQuery = searchResult.correctedQuery ?? query ?? "drug"

  return (
    <main className="min-h-screen bg-[#f8fbf8] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-8 lg:px-10">
        <Navbar />
      </div>

      <section className="px-4 pb-16 pt-24 sm:px-8 sm:pb-18 sm:pt-30 lg:px-10">
        <div className="mx-auto max-w-3xl lg:max-w-5xl">
          <div className="rounded-[1.65rem] border border-[rgba(31,86,73,0.08)] bg-white p-3 shadow-[0_18px_50px_rgba(31,86,73,0.06)] sm:rounded-[2rem] sm:p-5">
            <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,#f8fcf9_0%,#f2f8f4_100%)] p-4 sm:rounded-[1.7rem] sm:p-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[0_10px_24px_rgba(31,86,73,0.08)] sm:h-11 sm:w-11">
                  <Search className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                    Search result
                  </p>
                  <h1 className="truncate text-[1.2rem] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[1.8rem]">
                    {displayQuery}
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#557267] shadow-[0_8px_18px_rgba(31,86,73,0.05)]">
                  {searchResult.drugResults.length} drug match
                  {searchResult.drugResults.length === 1 ? "" : "es"}
                </span>
                {searchResult.correctedQuery &&
                  searchResult.correctedQuery !== query && (
                    <span className="rounded-full bg-[#eaf6ef] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]">
                      Corrected from {query}
                    </span>
                  )}
              </div>

              {searchResult.relatedQueries.length > 0 && (
                <div className="mt-4 rounded-[1.15rem] border border-[rgba(31,86,73,0.08)] bg-white/90 p-3 sm:rounded-[1.35rem]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                      AI suggestions
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {searchResult.relatedQueries.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[var(--color-secondary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:mt-7 sm:gap-5">
            {searchResult.drugResults.length ? (
              searchResult.drugResults.map((result) => (
                <SearchResultCard key={result.drug.id} result={result} />
              ))
            ) : (
              <div className="rounded-[1.65rem] border border-dashed border-[var(--color-border)] bg-white px-5 py-10 text-center shadow-[0_18px_50px_rgba(31,86,73,0.04)] sm:rounded-[2rem] sm:px-6 sm:py-12">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-foreground)] sm:text-xl">
                  No mock results yet
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#648277]">
                  Try Paracetamol, Ventolin, Amatem, Postinor, ORS, or a typo
                  like Paracitamol to test the mock search flow.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default SearchPage
