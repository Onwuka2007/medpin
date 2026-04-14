import React, { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { mockDrugs, mockInventory } from "../data/mock/index.js"
import OverviewTab    from "../components/pharmacy-dashboard/tabs/OverviewTab.jsx"
import DrugListTab    from "../components/pharmacy-dashboard/tabs/DrugListTab.jsx"
import InventoryTab   from "../components/pharmacy-dashboard/tabs/InventoryTab.jsx"
import SettingsTab    from "../components/pharmacy-dashboard/tabs/SettingsTab.jsx"

/* ────────────────────────────────────────────────────────────
   PharmacyDashboardPage  -  tab-router shell

   URL: /pharmacy/dashboard?tab=overview|drugs|inventory

   Inventory state lives here so both DrugListTab (adds items)
   and InventoryTab (displays / edits items) share the same data.
──────────────────────────────────────────────────────────── */

const CURRENT_PHARMACY_ID = "pharm-alpha-mainland"

/* Helper: derive status label from quantity */
function statusFromQty(qty) {
  if (qty <= 0) return "out_of_stock"
  if (qty <= 5) return "low_stock"
  return "in_stock"
}

/* Seed inventory from mock data for the current pharmacy */
function buildInitialInventory() {
  const drugLookup = new Map(mockDrugs.map((d) => [d.id, d]))

  return mockInventory
    .filter((item) => item.pharmacyId === CURRENT_PHARMACY_ID)
    .map((item) => {
      const drug = drugLookup.get(item.drugId)
      return {
        inventoryId: item.id,
        drugKey:     item.drugId,
        drugId:      item.drugId,
        name:        drug?.name        ?? item.drugId,
        genericName: drug?.genericName ?? "Unknown",
        category:    drug?.category    ?? "General",
        form:        drug?.form        ?? item.packSize,
        strength:    drug?.strength    ?? item.packSize,
        packSize:    item.packSize,
        quantity:    item.quantity,
        unitPrice:   item.unitPrice ?? 0,
        status:      item.status,
        notes:       "",
        updatedAt:   item.updatedAt,
      }
    })
}

/* Valid tab IDs */
const VALID_TABS = ["overview", "drugs", "inventory", "settings"]

export default function PharmacyDashboardPage() {
  const [searchParams] = useSearchParams()

  // Active tab - falls back to "overview" if missing or invalid
  const rawTab = searchParams.get("tab")
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : "overview"

  // Shared inventory state - mutated by both DrugListTab and InventoryTab
  const [inventoryItems, setInventoryItems] = useState(buildInitialInventory)

  // Set of drug IDs already in inventory (prevents duplicate adds)
  const inventoryKeys = useMemo(
    () => new Set(inventoryItems.map((i) => i.drugKey)),
    [inventoryItems]
  )

  /* Add a drug from the Drug List tab into inventory */
  const handleAddToInventory = (drug, stockData) => {
    setInventoryItems((current) => {
      if (current.some((i) => i.drugKey === drug.drugKey || i.drugId === drug.id)) {
        return current
      }
      return [
        {
          inventoryId: `draft-${drug.id}-${Date.now()}`,
          drugKey:     drug.id,
          drugId:      drug.id,
          name:        drug.name,
          genericName: drug.genericName ?? "Not provided",
          category:    drug.category    ?? "General",
          form:        drug.form        ?? "Unknown",
          strength:    drug.strength    ?? "N/A",
          packSize:    drug.form        ?? "Pack size pending",
          quantity:    stockData.quantity  ?? 1,
          unitPrice:   stockData.unitPrice ?? 0,
          status:      statusFromQty(stockData.quantity ?? 1),
          notes:       stockData.notes ?? "",
          updatedAt:   new Date().toISOString(),
        },
        ...current,
      ]
    })
  }

  /* Edit an existing inventory item (from InventoryTab modal) */
  const handleUpdateInventoryItem = (inventoryId, stockData) => {
    setInventoryItems((current) =>
      current.map((item) => {
        if (item.inventoryId !== inventoryId) return item
        const qty = Number(stockData.quantity) || 0
        return {
          ...item,
          quantity:  qty,
          unitPrice: Number(stockData.unitPrice) || 0,
          notes:     stockData.notes ?? item.notes,
          status:    statusFromQty(qty),
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  return (
    <>
      {activeTab === "overview"   && <OverviewTab />}
      {activeTab === "drugs"      && (
        <DrugListTab
          inventoryKeys={inventoryKeys}
          onAddToInventory={handleAddToInventory}
        />
      )}
      {activeTab === "settings"   && <SettingsTab />}
      {activeTab === "inventory"  && (
        <InventoryTab
          items={inventoryItems}
          onUpdate={handleUpdateInventoryItem}
        />
      )}
    </>
  )
}
