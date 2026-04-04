import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, MapPinOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSmartSuggestions } from "../../services/aiServices.js";
import {
  buildDrugCatalogForAi,
  getDidYouMeanSuggestion,
  getDrugById,
  searchDrugsFallback,
} from "../../services/searchService.js";
import {
  loadStoredLastQuery,
  persistSearchSession,
} from "../../lib/searchStorage.js";
import { Button } from "../ui/button.jsx";

function DrugSearch() {
  const [query, setQuery] = useState(() => loadStoredLastQuery());
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setRecommendations([]);
      setRecLoading(false);
      return;
    }

    let cancelled = false;
    setRecLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const catalog = buildDrugCatalogForAi();
        const ai = await getSmartSuggestions(q, catalog);
        if (cancelled) return;

        if (ai?.suggestions?.length) {
          const items = ai.suggestions
            .map((s) => {
              const drug = getDrugById(s.id);
              if (!drug) return null;
              return {
                id: drug.id,
                query: drug.name,
                title: s.name || drug.name,
                subtitle: `${drug.genericName} • ${drug.strength}`,
                reason: s.reason || "Suggested match",
              };
            })
            .filter(Boolean);
          setRecommendations(items.slice(0, 5));
        } else {
          const fb = searchDrugsFallback(q, null).drugResults.slice(0, 5);
          setRecommendations(
            fb.map((row) => ({
              id: row.drug.id,
              query: row.drug.name,
              title: row.drug.name,
              subtitle: `${row.drug.genericName} • ${row.drug.strength}`,
              reason: "Catalog match",
            })),
          );
        }
      } catch {
        if (!cancelled) {
          const fb = searchDrugsFallback(q, null).drugResults.slice(0, 5);
          setRecommendations(
            fb.map((row) => ({
              id: row.drug.id,
              query: row.drug.name,
              title: row.drug.name,
              subtitle: `${row.drug.genericName} • ${row.drug.strength}`,
              reason: "Catalog match",
            })),
          );
        }
      } finally {
        if (!cancelled) setRecLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const didYouMeanRaw = useMemo(() => getDidYouMeanSuggestion(query), [query]);

  const didYouMean =
    didYouMeanRaw && recommendations[0]?.title !== didYouMeanRaw.suggestedName
      ? didYouMeanRaw
      : null;

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function requestLocationAndSearch(targetQuery) {
    const trimmedQuery = targetQuery.trim();

    if (!trimmedQuery || isLocating) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Location is required to find pharmacies near you.");
      return;
    }

    setLocationError("");
    setIsLocating(true);
    setIsOpen(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        persistSearchSession({
          userLocation,
          lastQuery: trimmedQuery,
        });

        setQuery("");
        setRecommendations([]);
        setIsOpen(false);

        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`, {
          state: { userLocation },
        });
      },
      () => {
        setLocationError(
          "Turn on location access to find pharmacies near you.",
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    requestLocationAndSearch(query);
  }

  function handleRecommendationSelect(selectedQuery) {
    setQuery(selectedQuery);
    requestLocationAndSearch(selectedQuery);
  }

  return (
    <div
      id="find-drug"
      ref={searchRef}
      className="relative z-90 mt-8 w-full max-w-3xl scroll-mt-32 sm:mt-9"
    >
      {/* search drugs */}
      <form
        onSubmit={handleSubmit}
        className="rounded-full border border-(--color-border) bg-[linear-gradient(180deg,rgba(244,250,246,0.98),rgba(239,247,242,0.96))] p-1.5 shadow-[0_18px_50px_rgba(135,170,151,0.22)] sm:rounded-full sm:p-2"
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[1.6rem] border border-(--color-input) bg-(--color-surface) p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:rounded-full">
          <label className="group flex min-w-0 items-center gap-2.5 rounded-[1.35rem] px-3 py-2 text-left sm:gap-3 sm:rounded-full sm:px-5 sm:py-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-secondary)_0%,#deeee5_100%)] text-(--color-primary) shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:flex">
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
                setQuery(event.target.value);
                setLocationError("");
                setIsOpen(true);
              }}
              className="w-full bg-transparent text-[15px] font-medium text-(--color-foreground) outline-none placeholder:text-[13px] placeholder:text-(--color-muted) sm:text-[1rem] sm:placeholder:text-[1rem]"
            />
          </label>

          <Button
            type="submit"
            size="icon"
            disabled={isLocating}
            className="h-11 w-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 sm:h-13 sm:w-auto sm:px-7 sm:py-3 sm:text-[0.98rem] sm:font-semibold"
          >
            {isLocating ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin sm:hidden" />
                <span className="hidden sm:inline">Finding pharmacies...</span>
              </>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-none stroke-current stroke-[2.2] sm:hidden"
                >
                  <path
                    d="M7 17 17 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7h8v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">Find pharmacies</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {isLocating && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-[rgba(248,251,248,0.88)] px-4 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-secondary) text-(--color-primary)">
              <LoaderCircle className="h-6 w-6 animate-spin" />
            </div>
            <p className="mt-5 text-lg font-semibold tracking-[-0.03em] text-(--color-foreground)">
              Finding pharmacies near you
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#648277]">
              Checking your location and matching the drug with nearby
              pharmacies.
            </p>
          </div>
        </div>
      )}

      {locationError && !isLocating && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#f2d1d1] bg-[#fff7f7] px-3 py-3 text-sm text-[#9b4b4b] shadow-[0_12px_24px_rgba(31,86,73,0.04)]">
          <MapPinOff className="h-4 w-4" />
          {locationError}
        </div>
      )}

      {isOpen &&
        query.trim() &&
        !isLocating &&
        (didYouMean || recLoading || recommendations.length > 0) && (
          <div className="absolute inset-x-0 top-[calc(100%+0.65rem)] z-100 overflow-hidden rounded-[1.35rem] border border-[rgba(31,86,73,0.1)] bg-[rgba(255,255,255,0.94)] p-2 shadow-[0_24px_80px_rgba(31,86,73,0.16)] backdrop-blur-xl sm:top-[calc(100%+0.8rem)] sm:rounded-[1.75rem]">
            {didYouMean && (
              <div className="mb-2 rounded-[1.25rem] border border-[rgba(31,86,73,0.12)] bg-[#f7fbf8] px-3 py-3 sm:px-4">
                <p className="text-[13px] text-(--color-foreground) sm:text-sm">
                  Did you mean{" "}
                  <span className="font-semibold text-(--color-primary)">
                    {didYouMean.suggestedName}
                  </span>
                  ?
                </p>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() =>
                    requestLocationAndSearch(didYouMean.searchQuery)
                  }
                  className="mt-2 text-left text-[13px] font-semibold text-(--color-primary) underline-offset-2 hover:underline sm:text-sm"
                >
                  Search for {didYouMean.suggestedName}
                </button>
              </div>
            )}

            {(recLoading || recommendations.length > 0) && (
              <>
                <div className="flex items-center gap-2 px-2 py-2 text-left sm:px-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--color-secondary) text-(--color-primary)">
                    {recLoading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-(--color-foreground) sm:text-sm">
                      MedPin AI suggestions
                    </p>
                    <p className="text-xs text-[#6d877e]">
                      {recLoading
                        ? "Matching against our drug catalog…"
                        : "Pick a drug. We’ll ask for location before showing pharmacies."}
                    </p>
                  </div>
                </div>

                <div className="hide-scrollbar mt-1 grid max-h-72 gap-1 overflow-y-auto pr-1 sm:max-h-80">
                  {recLoading && recommendations.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-[#6d877e]">
                      Loading suggestions…
                    </div>
                  ) : null}
                  {recommendations.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleRecommendationSelect(item.query)}
                      className="group flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-(--color-surface-soft) sm:gap-4 sm:rounded-[1.25rem] sm:px-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[13px] font-semibold text-(--color-foreground) sm:text-sm">
                            {item.title}
                          </p>
                        </div>
                        <p className="mt-1 text-[13px] text-[#6b857b] sm:text-sm">
                          {item.subtitle}
                        </p>
                        <p className="mt-1 text-xs text-(--color-primary)">
                          {item.reason}
                        </p>
                      </div>

                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(31,86,73,0.08)] bg-white/80 text-(--color-primary) shadow-[0_10px_24px_rgba(31,86,73,0.08)] transition duration-300 ease-in-out group-hover:cursor-pointer group-hover:bg-(--color-primary) group-hover:text-white sm:h-9 sm:w-9">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}

export default DrugSearch;
