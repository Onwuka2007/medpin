import { Navigation, Phone } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { getGoogleMapsSearchUrl, getStatusClasses, getStatusLabel } from "./pharmacyUtils.js";

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

export default PharmacyRow;
