import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  Clock,
  Truck,
  SlidersHorizontal,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { mockPharmacies } from "../data/mock/pharmacies.js";
import SiteFooter from "../components/layout/SiteFooter.jsx";

const ALL_STATES = ["All states", ...new Set(mockPharmacies.map((p) => p.state))];

export default function FindPharmaciesPage() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All states");
  const [openNow, setOpenNow] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockPharmacies.filter((p) => {
      const textMatch = !q || [p.name, p.area, p.address, p.city, p.state]
        .some((v) => v?.toLowerCase().includes(q));
      const stateMatch = stateFilter === "All states" || p.state === stateFilter;
      const openMatch = !openNow || p.openNow;
      const delivMatch = !deliveryOnly || p.deliveryAvailable;
      return textMatch && stateMatch && openMatch && delivMatch;
    });
  }, [query, stateFilter, openNow, deliveryOnly]);

  return (
    <div className="min-h-screen bg-[#f8fbf8] text-slate-900">
      <section className="bg-[#1f5649] pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find a pharmacy near you
          </h1>
          <p className="mt-3 text-sm text-emerald-200 sm:text-base">
            Browse verified pharmacies across Nigeria - check opening hours, services, and availability before you go.
          </p>

          {/* Search bar */}
          <div className="relative mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by pharmacy name, area or address…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>
        </div>
      </section>

      {/* Filters + results  */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">

          {/* State dropdown */}
          <div className="relative">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              {ALL_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Toggle: Open now */}
          <ToggleChip active={openNow} onClick={() => setOpenNow((v) => !v)}>
            <Clock size={13} />
            Open now
          </ToggleChip>

          {/* Toggle: Delivery */}
          <ToggleChip active={deliveryOnly} onClick={() => setDeliveryOnly((v) => !v)}>
            <Truck size={13} />
            Delivery available
          </ToggleChip>

          {/* Result count - pushed to the right */}
          <span className="ml-auto text-xs text-slate-400">
            {filtered.length} {filtered.length === 1 ? "pharmacy" : "pharmacies"} found
          </span>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Search size={36} className="mx-auto mb-4 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No pharmacies match your filters.</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting the search or removing a filter.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

/*  Pharmacy card */
function PharmacyCard({ pharmacy }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={pharmacy.profileImage}
          alt={pharmacy.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Open / Closed pill */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pharmacy.openNow
              ? "bg-emerald-500 text-white"
              : "bg-slate-700/80 text-slate-200"
            }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${pharmacy.openNow ? "bg-white/70" : "bg-slate-400"}`} />
          {pharmacy.openNow ? "Open now" : "Closed"}
        </span>

        {/* Delivery pill */}
        {pharmacy.deliveryAvailable && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm">
            <Truck size={10} />
            Delivery
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-sm font-semibold text-slate-800">{pharmacy.name}</h2>
              {pharmacy.verificationStatus === "verified" && (
                <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">{pharmacy.type}</p>
          </div>

          {/* Rating */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-700">{pharmacy.rating}</span>
            <span className="text-[10px] text-amber-500">({pharmacy.reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
          <span>{pharmacy.locationSummary}</span>
        </div>

        {/* Hours */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={12} className="shrink-0 text-slate-400" />
          <span>Weekdays: {pharmacy.hours.weekdays}</span>
        </div>

        {/* Services */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pharmacy.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Insurance */}
        {pharmacy.acceptsInsurance?.length > 0 && (
          <p className="mt-2 text-[10px] text-slate-400">
            Insurance: {pharmacy.acceptsInsurance.join(", ")}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${pharmacy.phone}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
          >
            <Phone size={13} />
            Call
          </a>
          {pharmacy.whatsapp && (
            <a
              href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* Toggle chip  */
function ToggleChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }`}
    >
      {children}
    </button>
  );
}
