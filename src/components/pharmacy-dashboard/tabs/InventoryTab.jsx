import React, { useState, useMemo } from "react"
import PageHeader from "../PageHeader.jsx"
import { Search, Filter, Package } from "lucide-react"
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

/* ────────────────────────────────────────────────────────────
   InventoryTab  -  shows the pharmacy's current stock.

   Columns: Drug | Generic | Category | Strength/Form | Qty | Price | Status | Action
   Filters: search, status filter
   On "Edit" click → StockUpdateModal (edit mode)
──────────────────────────────────────────────────────────── */

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
})

/** Map status key → Badge variant + label */
const STATUS_MAP = {
  in_stock:     { variant: "success", label: "In stock"    },
  low_stock:    { variant: "warning", label: "Low stock"   },
  out_of_stock: { variant: "danger",  label: "Out of stock" },
}

export default function InventoryTab({ items = [], onUpdate }) {
  const [searchQuery,  setSearchQuery]  = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editItem,     setEditItem]     = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)

  /* Filtered + searched list */
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return items.filter((item) => {
      const textMatch = !q || [item.name, item.genericName, item.category]
        .some((v) => v?.toLowerCase().includes(q))
      const statusMatch = statusFilter === "all" || item.status === statusFilter
      return textMatch && statusMatch
    })
  }, [items, searchQuery, statusFilter])

  /* Summary stats */
  const stats = useMemo(() => {
    const total      = items.length
    const lowOrOut   = items.filter((i) => i.status !== "in_stock").length
    const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
    return { total, lowOrOut, totalValue }
  }, [items])

  const handleEditClick = (item) => {
    setEditItem(item)
    setModalOpen(true)
  }

  const handleSave = (stockData) => {
    if (!editItem) return
    onUpdate(editItem.inventoryId, stockData)
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="My Stock"
          description="Current inventory for Alpha Pharmacy · Mainland branch"
        />

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-2">
          <StatPill label="Total listed" value={stats.total} />
          <StatPill label="Low / Out"    value={stats.lowOrOut}   tone="amber" />
          <StatPill label="Est. value"   value={NGN.format(stats.totalValue)} />
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full min-w-0 sm:flex-1 sm:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search drug name, generic, category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter size={14} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="in_stock">In stock</SelectItem>
              <SelectItem value="low_stock">Low stock</SelectItem>
              <SelectItem value="out_of_stock">Out of stock</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-xs text-slate-400">
            {filteredItems.length} of {items.length} items
          </span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Drug</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Strength / Form</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="hidden sm:table-cell">Unit price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Package size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm text-slate-400">
                    {items.length === 0
                      ? "No drugs in inventory yet. Add from the Drug List tab."
                      : "No items match your search or filter."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const statusInfo = STATUS_MAP[item.status] ?? STATUS_MAP.in_stock
                return (
                  <TableRow key={item.inventoryId}>
                    {/* Drug name */}
                    <TableCell>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.genericName}</p>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[11px]">{item.category}</Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-sm text-slate-600">
                      {[item.strength, item.form].filter(Boolean).join(" · ")}
                    </TableCell>

                    {/* Qty with colour hint */}
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          item.status === "out_of_stock"
                            ? "text-rose-600"
                            : item.status === "low_stock"
                              ? "text-amber-600"
                              : "text-slate-800"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-slate-700">
                      {item.unitPrice ? NGN.format(item.unitPrice) : <span className="text-slate-400">-</span>}
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-slate-400">
                      {new Date(item.updatedAt).toLocaleDateString("en-NG", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </TableCell>

                    {/* Edit action */}
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Notes ───────────────────────────────────────── */}
      {items.length > 0 && (
        <p className="text-xs text-slate-400">
          Edits update local state only. Changes will persist to backend once API integration is complete.
        </p>
      )}

      {/* ── Edit Modal ──────────────────────────────────── */}
      <StockUpdateModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null) }}
        drug={editItem}
        initialData={editItem ? {
          quantity:  editItem.quantity,
          unitPrice: editItem.unitPrice,
          notes:     editItem.notes,
        } : {}}
        mode="edit"
        onSave={handleSave}
      />
    </div>
  )
}

/** Small stat pill for the header row */
function StatPill({ label, value, tone = "default" }) {
  const cls = tone === "amber"
    ? "border-amber-200 bg-amber-50 text-amber-800"
    : "border-slate-200 bg-white text-slate-800"

  return (
    <div className={`rounded-xl border px-3 py-2 text-center shadow-sm ${cls}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  )
}