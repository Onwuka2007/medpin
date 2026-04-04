import { useEffect, useState } from "react";
import { LoaderCircle, MapPinOff } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchResultCard from "../components/search/SearchResultCard.jsx";
import { loadStoredUserLocation } from "../lib/searchStorage.js";
import { getSmartSuggestions } from "../services/aiServices.js";
import {
  buildDrugCatalogForAi,
  buildResultsFromDrugIds,
  searchDrugsFallback,
} from "../services/searchService.js";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get("q") ?? "";
  const userLocation = location.state?.userLocation ?? loadStoredUserLocation();

  const [searchState, setSearchState] = useState({
    status: "idle",
    drugResults: [],
    usedFallback: false,
  });

  useEffect(() => {
    if (!query.trim() || !userLocation) {
      setSearchState({
        status: "idle",
        drugResults: [],
        usedFallback: false,
      });
      return;
    }

    let cancelled = false;

    setSearchState((prev) => ({
      ...prev,
      status: "loading",
    }));
    (async () => {
      const catalog = buildDrugCatalogForAi();
      const ai = await getSmartSuggestions(query.trim(), catalog);

      if (cancelled) return;

      const ids = ai?.suggestions?.map((s) => s.id) ?? [];
      let drugResults = buildResultsFromDrugIds(ids, userLocation);

      if (drugResults.length === 0) {
        drugResults = searchDrugsFallback(query, userLocation).drugResults;
        setSearchState({
          status: "ready",
          drugResults,
          usedFallback: true,
        });
        return;
      }

      setSearchState({
        status: "ready",
        drugResults,
        usedFallback: false,
      });
    })().catch(() => {
      if (cancelled) return;
      setSearchState({
        status: "ready",
        drugResults: searchDrugsFallback(query, userLocation).drugResults,
        usedFallback: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [query, userLocation]);

  const activeResult = searchState.drugResults[0] ?? null;
  const isLoading = Boolean(
    userLocation && query.trim() && searchState.status === "loading",
  );

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
              Turn on location access from the home search to find pharmacies
              near you, or run a new search so we can save your location in this
              browser.
            </p>
          </div>
        </section>
      ) : isLoading ? (
        <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--color-secondary) text-(--color-primary)">
            <LoaderCircle className="h-7 w-7 animate-spin" />
          </div>
          <p className="mt-6 text-lg font-semibold tracking-[-0.03em] text-(--color-foreground)">
            AI is Consulting our medical catalog...
          </p>
          <p className="mx-auto mt-2 max-w-md text-center text-sm leading-7 text-[#648277]">
            Checking availability for{" "}
            <span className="font-medium text-slate-900 italic">
              "{query.trim()}"
            </span>{" "}
            at pharmacies near you.
          </p>
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
              {searchState.usedFallback
                ? "No partner pharmacy near your current location is stocking a matching drug in our catalog."
                : "Try a different spelling or search for the generic name."}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
