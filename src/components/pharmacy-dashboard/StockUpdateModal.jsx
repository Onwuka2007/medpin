import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Badge } from "@/components/ui/badge.jsx"

function currencyFormat(value) {
  if (!value) return ""
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function StockUpdateModal({
  open,
  onClose,
  drug,
  initialData = {},
  onSave,
  mode = "add",
}) {
  const [quantity,  setQuantity]  = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [notes,     setNotes]     = useState("")

  /* Sync fields when data changes */
  useEffect(() => {
    if (open) {
      setQuantity(initialData.quantity  ?? "")
      setUnitPrice(initialData.unitPrice ?? "")
      setNotes(initialData.notes        ?? "")
    }
  }, [open, initialData.quantity, initialData.unitPrice, initialData.notes])

  const handleSave = () => {
    onSave({ quantity: Number(quantity) || 0, unitPrice: Number(unitPrice) || 0, notes })
    onClose()
  }

  if (!drug) return null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add to Inventory" : "Update Stock"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Set the initial stock details before adding this drug to your inventory."
              : "Edit quantity, price, or notes for this stock item."}
          </DialogDescription>
        </DialogHeader>

        {/* Drug summary card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{drug.name}</p>
              <p className="text-xs text-slate-500">{drug.genericName}</p>
            </div>
            {drug.category && (
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {drug.category}
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {[drug.strength, drug.form].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Quantity */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Quantity in stock <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 24"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Unit price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Unit price (NGN)
            </label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 1800"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            {unitPrice && (
              <p className="mt-1 text-xs text-slate-400">
                {currencyFormat(unitPrice)} per unit
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Notes <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Expiry Jun 2026, cold-chain required…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-400"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            disabled={!quantity}
            onClick={handleSave}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === "add" ? "Add to inventory" : "Save changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
