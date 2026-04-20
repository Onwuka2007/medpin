import { useRef, useState } from "react";
import { CircleCheckBig, ChevronLeft, Navigation, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PharmacyMap from "../map/PharmacyMap.jsx";
import { Button } from "../ui/button.jsx";
import AlternativeSearchRow from "./AlternativeSearchRow.jsx";
import InfoSection from "./InfoSection.jsx";
import PharmacyRow from "./PharmacyRow.jsx";
import {
  getGoogleMapsSearchUrl,
  getStatusClasses,
  getStatusLabel,
} from "./pharmacyUtils.js";

const PEEK_HEIGHT = 200;

function MobileSheet({
  closestPharmacyResult,
  otherPharmacyResults,
  drug,
  alternatives,
  userLocation,
}) {
  const [expanded, setExpanded] = useState(false);
  const dragStartY = useRef(null);

  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - e.changedTouches[0].clientY;
    if (dy > 40) setExpanded(true);
    else if (dy < -40) setExpanded(false);
    dragStartY.current = null;
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-[1.75rem] bg-white shadow-[0_-16px_40px_rgba(31,86,73,0.14)] transition-transform duration-300 ease-out"
      style={{
        transform: expanded
          ? "translateY(0)"
          : `translateY(calc(100% - ${PEEK_HEIGHT}px))`,
        maxHeight: "85vh",
        overflowY: expanded ? "auto" : "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* drag handle */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="h-1.5 w-16 rounded-full bg-[#c9d9d1]" />
      </div>

      {/* peek — always visible */}
      <div className="px-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#799188]">
              Closest pharmacy
            </p>
            <h2 className="mt-0.5 truncate text-[1.1rem] font-semibold tracking-tight text-(--color-foreground)">
              {closestPharmacyResult.pharmacy.name}
            </h2>
            <p className="mt-0.5 text-xs text-[#648277]">
              {closestPharmacyResult.pharmacy.locationSummary}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-(--color-primary)">
            {closestPharmacyResult.priceLabel ?? "On request"}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(closestPharmacyResult.status)}`}
          >
            {getStatusLabel(closestPharmacyResult.status)}
          </span>
          <span className="rounded-full bg-[#f0f7f3] px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
            {closestPharmacyResult.distanceKm} km
          </span>
          <span className="rounded-full bg-[#f0f7f3] px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
            {closestPharmacyResult.etaMinutes} mins
          </span>
          <span className="rounded-full bg-[#f0f7f3] px-3 py-1.5 text-xs font-semibold text-(--color-primary)">
            {closestPharmacyResult.pharmacy.openNow ? "Open now" : "Closed"}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button asChild className="flex-1 gap-2 rounded-full">
            <a
              href={getGoogleMapsSearchUrl(closestPharmacyResult)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </a>
          </Button>
          <a
            href={`tel:${closestPharmacyResult.pharmacy.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-secondary) px-5 py-2 text-sm font-medium text-(--color-primary)"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        </div>
      </div>

      {/* expanded content */}
      <div className="border-t border-[rgba(31,86,73,0.08)]">
        {otherPharmacyResults.length > 0 && (
          <InfoSection title="Other pharmacies with this drug">
            <div>
              {otherPharmacyResults.map((item) => (
                <PharmacyRow key={item.inventoryId} item={item} />
              ))}
            </div>
          </InfoSection>
        )}

        <InfoSection title="Drug details">
          <div className="space-y-3 text-sm text-[#5e7a70]">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[1.1rem] font-semibold tracking-tight text-(--color-foreground)">
                {drug.name}
              </h2>
              <span className="rounded-full bg-[#f7fbf8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--color-primary)">
                {drug.form}
              </span>
            </div>
            <p className="text-[13px] text-[#648277]">
              {drug.genericName} • {drug.strength}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f8fbf8] px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">
                  Generic
                </p>
                <p className="mt-1 font-semibold text-(--color-foreground)">
                  {drug.genericName}
                </p>
              </div>
              <div className="rounded-xl bg-[#f8fbf8] px-3 py-3">
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

        {alternatives.length > 0 && (
          <InfoSection title="Can't find this? Try these alternatives" tone="warm">
            <p className="mb-4 text-sm leading-6 text-[#648277]">
              Tap one to run the same location search for that drug.
            </p>
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <AlternativeSearchRow
                  key={alt.id}
                  alternative={alt}
                  userLocation={userLocation}
                />
              ))}
            </div>
          </InfoSection>
        )}
      </div>
    </div>
  );
}

export default function SearchResultCard({ result, userLocation }) {
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
        <div className="flex h-[60vh] max-w-md flex-col items-center relative mx-auto justify-center px-4">
          <Link
            to="/"
            className="absolute z-10 top-10 left-10 bg-(--color-primary) rounded-full p-2"
          >
            <ChevronLeft size={20} className="text-(--color-secondary)" />
          </Link>
          <p className="text-center text-sm text-[#648277]">
            No nearby pharmacies have this drug in stock.
          </p>
          {alternatives.length > 0 && (
            <div className="mt-8">
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

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden">
        {/* full-screen map */}
        <div className="fixed inset-0 z-0">
          <PharmacyMap
            pharmacies={mapPharmacyResults}
            center={[
              closestPharmacyResult.pharmacy.coordinates.lat,
              closestPharmacyResult.pharmacy.coordinates.lng,
            ]}
          />
        </div>

        {/* back button */}
        <Link
          to="/"
          className="fixed top-5 left-4 z-50 flex items-center justify-center rounded-full bg-white/90 p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md"
        >
          <ChevronLeft size={20} className="text-(--color-primary)" />
        </Link>

        {/* drug found pill */}
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md">
            <CircleCheckBig size={14} strokeWidth={2.5} className="text-green-500 shrink-0" />
            <span className="text-xs font-medium text-(--color-foreground) whitespace-nowrap">
              {drug.name} · {mapPharmacyResults.length} pharmacies nearby
            </span>
          </div>
        </div>

        {/* draggable bottom sheet */}
        <MobileSheet
          closestPharmacyResult={closestPharmacyResult}
          otherPharmacyResults={otherPharmacyResults}
          drug={drug}
          alternatives={alternatives}
          userLocation={userLocation}
        />
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block">
        <div className="relative border-b border-[rgba(31,86,73,0.08)] bg-white/92 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="rounded-[1.6rem] border border-[rgba(31,86,73,0.1)] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(31,86,73,0.06)]">
              <div className="flex items-center gap-3">
                <CircleCheckBig size={20} strokeWidth={2.5} className="text-green-500" />
                <h1 className="truncate text-[15px] font-medium text-(--color-foreground)">
                  {drug.name} found in {mapPharmacyResults.length} nearby pharmacies
                </h1>
              </div>
            </div>
          </div>
          <div className="flex mx-auto items-center justify-center flex-wrap gap-2 pb-4">
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

        <div className="border-b border-[rgba(31,86,73,0.08)] bg-[#f8fbf8] px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mt-2 text-sm text-[#648277]">
                Best match near you is {closestPharmacyResult.pharmacy.name},{" "}
                {closestPharmacyResult.distanceKm} km away, currently{" "}
                {getStatusLabel(closestPharmacyResult.status).toLowerCase()}.
              </p>
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
                    {closestPharmacyResult.pharmacy.openNow ? "Open now" : "Closed"}
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
              <InfoSection title="Can't find this? Try these alternatives" tone="warm">
                <p className="mb-4 text-sm leading-6 text-[#648277]">
                  These options come from our medicine graph (linked to{" "}
                  <span className="font-medium text-(--color-foreground)">{drug.name}</span>
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
                    Tap any pharmacy below to open its exact location in Google Maps.
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
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">Generic</p>
                        <p className="mt-1 font-semibold text-(--color-foreground)">{drug.genericName}</p>
                      </div>
                      <div className="bg-[#f8fbf8] px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#7f968d]">Strength</p>
                        <p className="mt-1 font-semibold text-(--color-foreground)">{drug.strength}</p>
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
    </div>
  );
}
