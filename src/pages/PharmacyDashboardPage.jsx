import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { mockDrugs, mockInventory } from "../data/mock/index.js";
import OverviewTab from "../components/pharmacy-dashboard/tabs/OverviewTab.jsx";
import DrugListTab from "../components/pharmacy-dashboard/tabs/DrugListTab.jsx";
import InventoryTab from "../components/pharmacy-dashboard/tabs/InventoryTab.jsx";
import SettingsTab from "../components/pharmacy-dashboard/tabs/SettingsTab.jsx";

const CURRENT_PHARMACY_ID = "pharm-alpha-mainland";

function statusFromQty(qty) {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 5) return "low_stock";
  return "in_stock";
}

function buildInitialInventory() {
  const drugLookup = new Map(mockDrugs.map((d) => [d.id, d]));

  return mockInventory
    .filter((item) => item.pharmacyId === CURRENT_PHARMACY_ID)
    .map((item) => {
      const drug = drugLookup.get(item.drugId);
      return {
        inventoryId: item.id,
        drugKey: item.drugId,
        drugId: item.drugId,
        name: drug?.name ?? item.drugId,
        genericName: drug?.genericName ?? "Unknown",
        category: drug?.category ?? "General",
        form: drug?.form ?? item.packSize,
        strength: drug?.strength ?? item.packSize,
        packSize: item.packSize,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? 0,
        status: item.status,
        notes: "",
        updatedAt: item.updatedAt,
      };
    });
}

const VALID_TABS = ["overview", "drugs", "inventory", "settings"];

export default function PharmacyDashboardPage() {
  const [searchParams] = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : "overview";

  const [inventoryItems, setInventoryItems] = useState(buildInitialInventory);
  const inventoryKeys = useMemo(
    () => new Set(inventoryItems.map((i) => i.drugKey)),
    [inventoryItems]
  );

  const handleAddToInventory = (drug, stockData) => {
    setInventoryItems((current) => {
      if (current.some((i) => i.drugKey === drug.drugKey || i.drugId === drug.id)) {
        return current;
      }
      return [
        {
          inventoryId: `draft-${drug.id}-${Date.now()}`,
          drugKey: drug.id,
          drugId: drug.id,
          name: drug.name,
          genericName: drug.genericName ?? "Not provided",
          category: drug.category ?? "General",
          form: drug.form ?? "Unknown",
          strength: drug.strength ?? "N/A",
          packSize: drug.form ?? "Pack size pending",
          quantity: stockData.quantity ?? 1,
          unitPrice: stockData.unitPrice ?? 0,
          status: statusFromQty(stockData.quantity ?? 1),
          notes: stockData.notes ?? "",
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ];
    });
  };

  const handleUpdateInventoryItem = (inventoryId, stockData) => {
    setInventoryItems((current) =>
      current.map((item) => {
        if (item.inventoryId !== inventoryId) return item;
        const qty = Number(stockData.quantity) || 0;
        return {
          ...item,
          quantity: qty,
          unitPrice: Number(stockData.unitPrice) || 0,
          notes: stockData.notes ?? item.notes,
          status: statusFromQty(qty),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <>
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "drugs" && (
        <DrugListTab
          inventoryKeys={inventoryKeys}
          onAddToInventory={handleAddToInventory}
        />
      )}
      {activeTab === "settings" && <SettingsTab />}
      {activeTab === "inventory" && (
        <InventoryTab
          items={inventoryItems}
          onUpdate={handleUpdateInventoryItem}
        />
      )}
    </>
  );
}
