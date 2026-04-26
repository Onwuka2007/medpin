import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../PageHeader.jsx";
import { Search, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table.jsx";
import StockUpdateModal from "../StockUpdateModal.jsx";
import axios from "axios";

const PAGE_SIZE = 20;
const API_BASE = import.meta.env.VITE_NAFDAC_API_URL;

function mapApiDrug(d) {
  return {
    id: d.id,
    name: d.product_name,
    genericName: d.active_ingredients,
    strength: d.strength ?? "",
    form: d.dosage_form ?? "",
    category: d.product_category ?? "Drug",
    requiresPrescription: /prescription/i.test(d.marketing_category ?? ""),
    nafdacStatus: /^registered$/i.test(d.status ?? "") ? "registered" : "unregistered",
    nrn: d.nrn,
    manufacturer: d.manufacturer_name,
    registrationStatus: d.status,
    packSize: d.pack_size,
  };
}

export default function DrugListTab({ inventoryKeys = new Set(), onAddToInventory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [rxFilter, setRxFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [drugs, setDrugs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debounceRef = useRef(null);

  /* Debounce the search query and reset to page 1 */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  /* Fetch from API whenever debouncedQuery or page changes */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = debouncedQuery
      ? `${API_BASE}/drugs/search?q=${encodeURIComponent(debouncedQuery)}&page=${page}&limit=${PAGE_SIZE}`
      : `${API_BASE}/drugs?page=${page}&limit=${PAGE_SIZE}`;

    axios.get(url).then(({ data }) => {
      if (cancelled) return;
      const results = Array.isArray(data) ? data : (data.results ?? []);
      const metaObj = data.meta ?? {
        total: results.length,
        page,
        limit: PAGE_SIZE,
      };
      setDrugs(results.map(mapApiDrug));
      setMeta(metaObj);
    })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
  }, [debouncedQuery, page]);

  /* Client-side Rx/OTC filter on the current page's results */
  const filteredDrugs =
    rxFilter === "all"
      ? drugs
      : drugs.filter((d) =>
        rxFilter === "rx" ? d.requiresPrescription : !d.requiresPrescription
      );

  const totalPages = Math.max(1, Math.ceil(meta.total / PAGE_SIZE));

  const handleRowClick = (drug) => {
    if (inventoryKeys.has(drug.id)) return;
    setSelectedDrug(drug);
    setModalOpen(true);
  };

  const handleSave = (stockData) => {
    if (!selectedDrug) return;
    onAddToInventory(selectedDrug, stockData);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">

      <PageHeader
        title="Drug List"
        description="Browse all NAFDAC-registered Nigerian drugs. Click a row to add it to your inventory."
      />

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full min-w-0 sm:flex-1 sm:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search drug name or active ingredient…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={rxFilter} onValueChange={setRxFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rx / OTC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="rx">Prescription</SelectItem>
              <SelectItem value="otc">OTC only</SelectItem>
            </SelectContent>
          </Select>

          {!loading && (
            <span className="text-xs text-slate-400">
              {meta.total.toLocaleString()} drugs
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 sticky top-0">
              <TableHead>Drug name</TableHead>
              <TableHead className="hidden sm:table-cell">Active ingredient</TableHead>
              <TableHead className="hidden md:table-cell truncate">NAFDAC Number</TableHead>
              <TableHead className="hidden lg:table-cell">Form</TableHead>
              <TableHead className="hidden lg:table-cell">Strength</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                  <Loader2 size={20} className="inline-block animate-spin mr-2" />
                  Loading drugs…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-rose-400">
                  Failed to load drugs: {error}
                </TableCell>
              </TableRow>
            ) : filteredDrugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                  No drugs match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrugs.map((drug) => {
                const alreadyAdded = inventoryKeys.has(drug.id);
                return (
                  <TableRow
                    key={drug.id}
                    className={alreadyAdded ? "opacity-60" : "cursor-pointer"}
                    onClick={() => handleRowClick(drug)}
                  >
                    {/* Name + NAFDAC registration dot */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${drug.nafdacStatus === "registered"
                            ? "bg-emerald-500"
                            : "bg-amber-400"
                            }`}
                        />
                        <span className="font-medium text-slate-800">{drug.name}</span>
                      </div>
                      {drug.manufacturer && (
                        <p className="mt-0.5 pl-3.5 text-[11px] text-slate-400">
                          {drug.manufacturer}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-slate-600 max-w-[250px] truncate">
                      {drug.genericName}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px] whitespace-nowrap">
                        {drug.nrn}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {drug.form}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {drug.strength}
                    </TableCell>

                    <TableCell>
                      {drug.requiresPrescription ? (
                        <Badge variant="warning">Rx</Badge>
                      ) : (
                        <Badge variant="success">OTC</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {alreadyAdded ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 size={13} /> Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(drug);
                          }}
                        >
                          <span className="text-[12px]">Add</span>
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="text-xs">
            Page {meta.page} of {totalPages.toLocaleString()}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 p-1.5 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              return start + i;
            }).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`min-w-[32px] rounded-lg border px-2 py-1 text-xs transition ${p === page
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                  : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 p-1.5 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <StockUpdateModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDrug(null);
        }}
        drug={selectedDrug}
        mode="add"
        onSave={handleSave}
      />
    </div>
  );
}
