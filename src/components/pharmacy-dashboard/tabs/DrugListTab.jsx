import React, { useState, useMemo } from "react"
import PageHeader from "../PageHeader.jsx"
import { Search, Filter, CheckCircle2 } from "lucide-react"
import { Input }   from "@/components/ui/input.jsx"
import { Badge }   from "@/components/ui/badge.jsx"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table.jsx"
import StockUpdateModal from "../StockUpdateModal.jsx"
import { mockDrugs } from "../../../data/mock/index.js"

/* ────────────────────────────────────────────────────────────
   DrugListTab  -  browse the full MedPin drug catalogue.

   Columns: Drug name | Generic | Category | Form | Strength | Rx | Action
   Filters: text search, category dropdown
   On row click → StockUpdateModal (add mode) → calls onAddToInventory
──────────────────────────────────────────────────────────── */

/* All unique categories derived from mock data */
const ALL_CATEGORIES = ["All", ...new Set(mockDrugs.map((d) => d.category))]

export default function DrugListTab({ inventoryKeys = new Set(), onAddToInventory }) {
  const [searchQuery,       setSearchQuery]       = useState("")
  const [categoryFilter,    setCategoryFilter]    = useState("All")
  const [rxFilter,          setRxFilter]          = useState("all") // "all" | "rx" | "otc"
  const [selectedDrug,      setSelectedDrug]      = useState(null)
  const [modalOpen,         setModalOpen]         = useState(false)

  /* Filtered drug list */
  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return mockDrugs.filter((drug) => {
      // Text search across name, generic, brand names, synonyms
      const textMatch = !q || [drug.name, drug.genericName, ...(drug.brandNames ?? []), ...(drug.synonyms ?? [])]
        .some((v) => v?.toLowerCase().includes(q))

      // Category filter
      const catMatch = categoryFilter === "All" || drug.category === categoryFilter

      // Rx filter
      const rxMatch =
        rxFilter === "all" ||
        (rxFilter === "rx"  &&  drug.requiresPrescription) ||
        (rxFilter === "otc" && !drug.requiresPrescription)

      return textMatch && catMatch && rxMatch
    })
  }, [searchQuery, categoryFilter, rxFilter])

  const handleRowClick = (drug) => {
    // Prevent re-opening for already-added drugs
    if (inventoryKeys.has(drug.id)) return
    setSelectedDrug(drug)
    setModalOpen(true)
  }

  const handleSave = (stockData) => {
    if (!selectedDrug) return
    onAddToInventory(selectedDrug, stockData)
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">

      {/* ── Header ──────────────────────────────────────── */}
      <PageHeader
        title="Drug List"
        description="Browse the MedPin drug catalogue. Click a row to add it to your inventory."
      />

      {/* ── Filter bar ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search - full width on mobile, capped on larger screens */}
        <div className="relative w-full min-w-0 sm:flex-1 sm:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search drug name, generic, brand…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter size={14} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Rx / OTC toggle */}
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

          {/* Count */}
          <span className="text-xs text-slate-400">
            {filteredDrugs.length} of {mockDrugs.length} drugs
          </span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Drug name</TableHead>
              <TableHead className="hidden sm:table-cell">Generic</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Form</TableHead>
              <TableHead className="hidden lg:table-cell">Strength</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-400">
                  No drugs match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrugs.map((drug) => {
                const alreadyAdded = inventoryKeys.has(drug.id)
                return (
                  <TableRow
                    key={drug.id}
                    className={alreadyAdded ? "opacity-60" : "cursor-pointer"}
                    onClick={() => handleRowClick(drug)}
                  >
                    {/* Name + NAFDAC status dot */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${drug.nafdacStatus === "registered" ? "bg-emerald-500" : "bg-amber-400"}`} />
                        <span className="font-medium text-slate-800">{drug.name}</span>
                      </div>
                      {drug.brandNames?.length > 0 && (
                        <p className="mt-0.5 pl-3.5 text-[11px] text-slate-400">
                          {drug.brandNames.slice(0, 2).join(", ")}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-slate-600">{drug.genericName}</TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[11px]">{drug.category}</Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-slate-600">{drug.form}</TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">{drug.strength}</TableCell>

                    {/* Rx badge */}
                    <TableCell>
                      {drug.requiresPrescription
                        ? <Badge variant="warning">Rx</Badge>
                        : <Badge variant="success">OTC</Badge>
                      }
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      {alreadyAdded ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 size={13} /> Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                          onClick={(e) => { e.stopPropagation(); handleRowClick(drug) }}
                        >
                          Add
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Note ────────────────────────────────────────── */}
      <p className="text-xs text-slate-400">
        Drug catalogue is seeded from mock data. OpenFDA integration will be wired in the backend phase.
      </p>

      {/* ── Stock Update Modal ───────────────────────────── */}
      <StockUpdateModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDrug(null) }}
        drug={selectedDrug}
        mode="add"
        onSave={handleSave}
      />
    </div>
  )
}
