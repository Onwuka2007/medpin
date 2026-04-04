import {
  ArrowUpRight,
  ChevronLeft,
  CircleCheckBig,
  Navigation,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PharmacyMap from "../map/PharmacyMap.jsx";
import Logo from "../ui/Logo.jsx";
import { Button } from "../ui/button.jsx";

function getGoogleMapsSearchUrl(item) {
  const { lat, lng } = item.pharmacy.coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function getStatusLabel(status) {
  if (status === "low_stock") {
    return "Low stock";
  }

  return "In stock";
}

function getStatusClasses(status) {
  if (status === "low_stock") {
    return "bg-[#fff4de] text-[#9c6500]";
  }

  return "bg-[#e8f5ee] text-[#1f5649]";
}

function PharmacyRow({ item, primary = false }) {
  return (
    <div className="w-full border-b border-[rgba(31,86,73,0.08)] px-0 py-4 text-left last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-(--color-foreground) sm:text-[15px]">
              {item.pharmacy.name}
            </p>
            {primary && (
              <span className="rounded-full bg-(--color-secondary) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-(--color-primary)">
                Closest
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClasses(item.status)}`}
            >
              {getStatusLabel(item.status)}
            </span>
          </div>

          <p className="mt-1 text-xs text-[#6e887f] sm:text-[13px]">
            {item.pharmacy.locationSummary}
          </p>
        </div>

        <p className="shrink-0 text-sm font-semibold text-(--color-primary)">
          {item.priceLabel ?? "On request"}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6f897f]">
        <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1">
          {item.distanceKm} km away
        </span>
        <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1">
          {item.etaMinutes} mins
        </span>
        <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1">
          {item.packSize}
        </span>
        <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1">
          {item.pharmacy.openNow ? "Open now" : "Closed"}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-(--color-primary)">
        <Button
          asChild
          variant="ghost"
          className="h-auto gap-1 bg-(--color-secondary) px-2.5 py-1 text-xs font-medium text-(--color-primary) hover:bg-[#dceee5]"
        >
          <a
            href={getGoogleMapsSearchUrl(item)}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation className="h-3.5 w-3.5" />
            Open map
          </a>
        </Button>
        <span className="inline-flex items-center gap-1 rounded-full bg-(--color-secondary) px-2.5 py-1">
          <Phone className="h-3.5 w-3.5" />
          {item.pharmacy.phone}
        </span>
      </div>
    </div>
  );
}

function InfoSection({ title, children, tone = "white" }) {
  const toneClass = tone === "warm" ? "bg-[#fffdf8]" : "bg-white";

  return (
    <section className={`px-5 py-8 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function AlternativeSearchRow({ alternative, userLocation }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/search?q=${encodeURIComponent(alternative.name)}`, {
          state: { userLocation },
        })
      }
      className="group cursor-pointer flex w-full items-start justify-between gap-3 rounded-[1.25rem] border border-[rgba(31,86,73,0.1)] bg-white px-4 py-3 text-left transition hover:border-[rgba(31,86,73,0.2)] hover:bg-[#fbfdfb]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-(--color-foreground)">
          {alternative.name}
        </span>
        <span className="mt-1 block text-xs text-[#648277]">
          {alternative.genericName} • {alternative.strength}
        </span>
        <span className="mt-1 block text-xs text-(--color-primary)">
          Search nearby stock for this alternative
        </span>
      </span>
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(31,86,73,0.08)] bg-[#f7fbf8] text-(--color-primary) transition group-hover:bg-(--color-primary) group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function SearchResultCard({ result, userLocation }) {
  const {
    drug,
    closestPharmacyResult: rawClosest,
    otherPharmacyResults,
    mapPharmacyResults,
    alternatives,
  } = result;

  const closestPharmacyResult = rawClosest;
  const hasClosest = Boolean(rawClosest);

  if (!hasClosest) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#ffffff]">
        <div className="relative z-20 border-b border-[rgba(31,86,73,0.08)] bg-white/92 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Logo textClassName="text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="flex h-[60vh] max-w-md flex-col items-center relative mx-auto justify-center px-4">
          {/* back button */}
          <Link
            to="/"
            className="absolute z-10 top-10 left-10 bg-(--color-primary)  rounded-full p-2"
          >
            <ChevronLeft size={20}  className="text-(--color-secondary)"/>
          </Link>
          <p className="text-center text-sm text-[#648277]">
            No nearby pharmacies have this drug in stock.
          </p>

          {alternatives.length > 0 && (
            <div className="mt-8 ">
              <p className="text-center text-sm text-[#648277]">
                Try one of these alternatives:
              </p>
              <div className="mt-4 space-y-2">
                {alternatives.map((alt) => (
                  <AlternativeSearchRow
                    key={alt.id}
                    alternative={alt}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#ffffff]">
      <div className="relative z-20 border-b border-[rgba(31,86,73,0.08)] bg-white/92 backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Logo textClassName="text-xl sm:text-2xl" />
          </div>

          <div className="rounded-[1.6rem] border border-[rgba(31,86,73,0.1)] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(31,86,73,0.06)]">
            <div className="flex items-center gap-3">
              <CircleCheckBig
                size={20}
                strokeWidth={2.5}
                className="text-green-500"
              />
              <h1 className="truncate text-[15px] font-medium text-(--color-foreground) sm:text-[17px]">
                {drug.name} found in {mapPharmacyResults.length} nearby
                pharmacies
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[rgba(31,86,73,0.08)] bg-[#f8fbf8] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mt-2 text-sm text-[#648277]">
              Best match near you is {closestPharmacyResult.pharmacy.name},{" "}
              {closestPharmacyResult.distanceKm} km away, currently{" "}
              {getStatusLabel(closestPharmacyResult.status).toLowerCase()}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(closestPharmacyResult.status)}`}
            >
              {getStatusLabel(closestPharmacyResult.status)}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-(--color-primary) shadow-[0_8px_18px_rgba(31,86,73,0.06)]">
              {closestPharmacyResult.distanceKm} km away
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-(--color-primary) shadow-[0_8px_18px_rgba(31,86,73,0.06)]">
              {closestPharmacyResult.etaMinutes} mins away
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[56vh] min-h-88 w-full overflow-hidden sm:h-[62vh]">
        <PharmacyMap
          pharmacies={mapPharmacyResults}
          center={[
            closestPharmacyResult.pharmacy.coordinates.lat,
            closestPharmacyResult.pharmacy.coordinates.lng,
          ]}
        />

        <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-start sm:inset-x-6 lg:inset-x-8">
          <div className="rounded-full bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--color-primary) shadow-[0_12px_30px_rgba(31,86,73,0.12)] backdrop-blur-md">
            Closest pharmacy location
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-end sm:inset-x-6 lg:inset-x-8">
          <Button
            asChild
            variant="ghost"
            className="pointer-events-auto gap-2 bg-white/92 text-sm font-medium text-(--color-primary) shadow-[0_12px_30px_rgba(31,86,73,0.12)] backdrop-blur-md hover:bg-white"
          >
            <a
              href={getGoogleMapsSearchUrl(closestPharmacyResult)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" />
              View larger map
            </a>
          </Button>
        </div>
      </div>

      <div className="relative z-10 -mt-6 rounded-t-[1.75rem] bg-white shadow-[0_-16px_40px_rgba(31,86,73,0.08)] sm:-mt-8 sm:rounded-t-4xl">
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-16 rounded-full bg-[#c9d9d1]" />
        </div>

        <div className="border-t border-[rgba(31,86,73,0.08)]">
          <InfoSection title="Closest pharmacy with this drug">
            <div className="rounded-[1.25rem] border border-[rgba(31,86,73,0.08)] bg-[#fbfdfb] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[1.15rem] font-semibold tracking-[-0.04em] text-(--color-foreground) sm:text-[1.35rem]">
                    {closestPharmacyResult.pharmacy.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#648277]">
                    {closestPharmacyResult.pharmacy.locationSummary}
                  </p>
                </div>

                <p className="text-sm font-semibold text-(--color-primary)">
                  {closestPharmacyResult.priceLabel ?? "On request"}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(closestPharmacyResult.status)}`}
                >
                  {getStatusLabel(closestPharmacyResult.status)}
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
                  {closestPharmacyResult.distanceKm} km away
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
                  {closestPharmacyResult.etaMinutes} mins away
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
                  {closestPharmacyResult.pharmacy.openNow
                    ? "Open now"
                    : "Closed"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="gap-2 px-4">
                  <a
                    href={getGoogleMapsSearchUrl(closestPharmacyResult)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
                <span className="inline-flex items-center gap-2 rounded-full bg-(--color-secondary) px-4 py-2 text-sm font-medium text-(--color-primary)">
                  <Phone className="h-4 w-4" />
                  {closestPharmacyResult.pharmacy.phone}
                </span>
              </div>
            </div>
          </InfoSection>

          {alternatives.length > 0 && (
            <InfoSection
              title="Can't find this? Try these alternatives"
              tone="warm"
            >
              <p className="mb-4 text-sm leading-6 text-[#648277]">
                These options come from our medicine graph (linked to{" "}
                <span className="font-medium text-(--color-foreground)">
                  {drug.name}
                </span>
                ). Tap one to run the same location search for that drug.
              </p>
              <div className="space-y-2">
                {alternatives.map((alternative) => (
                  <AlternativeSearchRow
                    key={alternative.id}
                    alternative={alternative}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            </InfoSection>
          )}

          <div className="grid gap-0 border-t border-[rgba(31,86,73,0.08)] lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-[rgba(31,86,73,0.08)] lg:border-b-0 lg:border-r">
              <InfoSection title="Other pharmacies that have this drug">
                <p className="mb-3 text-sm leading-6 text-[#648277]">
                  Tap any pharmacy below to open its exact location in Google
                  Maps.
                </p>
                <div>
                  {otherPharmacyResults.map((item) => (
                    <PharmacyRow key={item.inventoryId} item={item} />
                  ))}
                </div>
              </InfoSection>
            </div>

            <div className="divide-y divide-[rgba(31,86,73,0.08)]">
              <InfoSection title="Drug details">
                <div className="space-y-3 text-sm text-[#5e7a70]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[1.1rem] font-semibold tracking-[-0.04em] text-(--color-foreground) sm:text-[1.35rem]">
                      {drug.name}
                    </h2>
                    <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--color-primary)">
                      {drug.form}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#648277] sm:text-sm">
                    {drug.genericName} • {drug.strength}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#f8fbf8] px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                        Generic
                      </p>
                      <p className="mt-1 font-semibold text-(--color-foreground)">
                        {drug.genericName}
                      </p>
                    </div>
                    <div className="bg-[#f8fbf8] px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                        Strength
                      </p>
                      <p className="mt-1 font-semibold text-(--color-foreground)">
                        {drug.strength}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f7fbf8] px-3 py-1.5 text-xs font-medium text-[#56746a]">
                      {drug.category}
                    </span>
                    <span className="rounded-full bg-[#f7fbf8] px-3 py-1.5 text-xs font-medium text-[#56746a]">
                      {drug.requiresPrescription
                        ? "Prescription likely needed"
                        : "OTC in many pharmacies"}
                    </span>
                  </div>

                  <p className="leading-7">{drug.description}</p>
                  <p className="leading-7">{drug.dosageSummary}</p>
                </div>
              </InfoSection>

              {drug.brandNames.length > 0 && (
                <InfoSection title="Brands">
                  <div className="flex flex-wrap gap-2">
                    {drug.brandNames.map((brand) => (
                      <span
                        key={brand}
                        className="rounded-full border border-[rgba(31,86,73,0.08)] bg-[#f8fbf8] px-3 py-1.5 text-xs text-[#5d796f]"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </InfoSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultCard;
