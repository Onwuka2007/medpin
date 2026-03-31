import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getMockSearchRecommendations } from "../../services/searchService.js"
import { Button } from "../ui/button.jsx"

function DrugSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const recommendations = useMemo(
    () => getMockSearchRecommendations(query),
    [query],
  )

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    setIsOpen(false)
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  function handleRecommendationSelect(selectedQuery) {
    setQuery(selectedQuery)
    setIsOpen(false)
    navigate(`/search?q=${encodeURIComponent(selectedQuery)}`)
  }

  return (
    <div ref={searchRef} className="relative z-[90] mt-8 w-full max-w-3xl sm:mt-9">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(244,250,246,0.98),rgba(239,247,242,0.96))] p-1.5 shadow-[0_18px_50px_rgba(135,170,151,0.22)] sm:rounded-full sm:p-2"
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[1.6rem] border border-[var(--color-input)] bg-[var(--color-surface)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:rounded-full">
          <label className="group flex min-w-0 items-center gap-2.5 rounded-[1.35rem] px-3 py-2 text-left sm:gap-3 sm:rounded-full sm:px-5 sm:py-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-secondary)_0%,#deeee5_100%)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:flex">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-[1.9]"
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search Paracetamol, Ventolin, Amatem..."
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value)
                setIsOpen(true)
              }}
              className="w-full bg-transparent text-[15px] font-medium text-[var(--color-foreground)] outline-none placeholder:text-[13px] placeholder:text-[var(--color-muted)] sm:text-[1rem] sm:placeholder:text-[1rem]"
            />
          </label>

          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 cursor-pointer sm:h-13 sm:w-auto sm:px-7 sm:py-3 sm:text-[0.98rem] sm:font-semibold"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current stroke-[2.2] sm:hidden"
            >
              <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Find pharmacies</span>
          </Button>
        </div>
      </form>

      {isOpen && query.trim() && recommendations.length > 0 && (
        <div className="absolute inset-x-0 top-[calc(100%+0.65rem)] z-[100] overflow-hidden rounded-[1.35rem] border border-[rgba(31,86,73,0.1)] bg-[rgba(255,255,255,0.94)] p-2 shadow-[0_24px_80px_rgba(31,86,73,0.16)] backdrop-blur-xl sm:top-[calc(100%+0.8rem)] sm:rounded-[1.75rem]">
          <div className="flex items-center gap-2 px-2 py-2 text-left sm:px-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-foreground)] sm:text-sm">
                MedPin AI suggestions
              </p>
              <p className="text-xs text-[#6d877e]">
                Pick the closest drug match to continue.
              </p>
            </div>
          </div>

          <div className="hide-scrollbar mt-1 grid max-h-72 gap-1 overflow-y-auto pr-1 sm:max-h-80">
            {recommendations.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleRecommendationSelect(item.query)}
                className="flex w-full group items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-(--color-surface-soft) sm:gap-4 sm:rounded-[1.25rem] sm:px-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-(--color-foreground) sm:text-sm">
                      {item.title}
                    </p>
                    <span className="rounded-full bg-(--color-secondary) px-2 py-0.5 text-[11px] font-medium text-(--color-primary)">
                      {item.nearbyCount} nearby
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-[#6b857b] sm:text-sm">
                    {item.subtitle}
                  </p>
                  <p className="mt-1 text-xs text-(--color-primary)">
                    {item.reason}
                  </p>
                </div>

                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(31,86,73,0.08)] bg-white/80 group-hover:bg-(--color-primary) transition duration-300 ease-in-out hover:cursor-pointer group-hover:text-white text-(--color-primary) shadow-[0_10px_24px_rgba(31,86,73,0.08)] sm:h-9 sm:w-9">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DrugSearch
