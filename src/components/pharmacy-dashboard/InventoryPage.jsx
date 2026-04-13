import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  LoaderCircle,
  PackagePlus,
  Search,
  Sparkles,
} from "lucide-react";
import { mockDrugs, mockInventory, mockPharmacies } from "../../data/mock/index.js";
import { searchOpenFdaDrugs } from "../../services/openFdaService.js";

const CURRENT_PHARMACY_ID = "pharm-alpha-mainland";

function currencyFormatter(value) {
  if (value == null) return "Add price";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusFromQuantity(quantity) {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
}

function statusLabel(status) {
  if (status === "low_stock") return "Low stock";
  if (status === "out_of_stock") return "Out of stock";
  return "In stock";
}

function mapMockDrugToCatalogItem(drug) {
  return {
    id: drug.id,
    source: "mock",
    name: drug.name,
    genericName: drug.genericName,
    strength: drug.strength,
    form: drug.form,
    status: drug.nafdacStatus,
  };
}

function buildInitialInventory() {
  const drugLookup = new Map(mockDrugs.map((drug) => [drug.id, drug]));

  return mockInventory
    .filter((item) => item.pharmacyId === CURRENT_PHARMACY_ID)
    .map((item) => {
      const drug = drugLookup.get(item.drugId);

      return {
        inventoryId: item.id,
        drugKey: item.drugId,
        drugId: item.drugId,
        source: "mock",
        name: drug?.name ?? item.drugId,
        genericName: drug?.genericName ?? "Unknown",
        form: drug?.form ?? item.packSize,
        strength: drug?.strength ?? item.packSize,
        packSize: item.packSize,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? 0,
        status: item.status,
        updatedAt: item.updatedAt,
      };
    });
}

const InventoryPage = () => {
  const pharmacy = mockPharmacies.find(
    (item) => item.id === CURRENT_PHARMACY_ID,
  );
  const [inventoryItems, setInventoryItems] = useState(buildInitialInventory);
  const [query, setQuery] = useState("");
  const [remoteResults, setRemoteResults] = useState([]);
  const [searchState, setSearchState] = useState("idle");

  const inventoryKeys = useMemo(
    () => new Set(inventoryItems.map((item) => item.drugKey)),
    [inventoryItems],
  );

  const curatedResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const localCatalog = mockDrugs.map(mapMockDrugToCatalogItem);

    if (!normalizedQuery) {
      return localCatalog.slice(0, 6);
    }

    return localCatalog
      .filter((drug) =>
        [drug.name, drug.genericName, drug.form, drug.strength]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setRemoteResults([]);
      setSearchState("idle");
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setSearchState("loading");

      try {
        const results = await searchOpenFdaDrugs(trimmedQuery, {
          signal: controller.signal,
        });
        setRemoteResults(results);
        setSearchState("ready");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setRemoteResults([]);
        setSearchState("error");
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const mergedResults = useMemo(() => {
    const seen = new Set();
    const combined = [];

    for (const result of [...curatedResults, ...remoteResults]) {
      const key = `${result.source}:${result.id}`;

      if (seen.has(key)) continue;
      seen.add(key);
      combined.push({
        ...result,
        drugKey: key,
        alreadyAdded: inventoryKeys.has(key) || inventoryKeys.has(result.id),
      });
    }

    return combined;
  }, [curatedResults, remoteResults, inventoryKeys]);

  const stats = useMemo(() => {
    const lowStockCount = inventoryItems.filter(
      (item) => item.status === "low_stock" || item.status === "out_of_stock",
    ).length;
    const totalValue = inventoryItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return {
      listedDrugs: inventoryItems.length,
      lowStockCount,
      totalValue,
    };
  }, [inventoryItems]);

  const handleAddDrug = (drug) => {
    setInventoryItems((current) => {
      if (
        current.some(
          (item) => item.drugKey === drug.drugKey || item.drugId === drug.id,
        )
      ) {
        return current;
      }

      const now = new Date().toISOString();

      return [
        {
          inventoryId: `draft-${drug.source}-${drug.id}`,
          drugKey: drug.drugKey,
          drugId: drug.id,
          source: drug.source,
          name: drug.name,
          genericName: drug.genericName || "Not provided",
          form: drug.form || "Unknown form",
          strength: drug.strength || "Strength not listed",
          packSize: drug.form || "Pack size pending",
          quantity: 1,
          unitPrice: 0,
          status: "in_stock",
          updatedAt: now,
        },
        ...current,
      ];
    });
  };

  const handleInventoryChange = (inventoryId, field, rawValue) => {
    setInventoryItems((current) =>
      current.map((item) => {
        if (item.inventoryId !== inventoryId) {
          return item;
        }

        if (field === "quantity") {
          const quantity = Number(rawValue) || 0;
          return {
            ...item,
            quantity,
            status: statusFromQuantity(quantity),
            updatedAt: new Date().toISOString(),
          };
        }

        if (field === "unitPrice") {
          return {
            ...item,
            unitPrice: Number(rawValue) || 0,
            updatedAt: new Date().toISOString(),
          };
        }

        return {
          ...item,
          [field]: rawValue,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-[1.75rem] border border-emerald-100 bg-linear-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Inventory workspace
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Keep your shelf data live
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Search the MedPin mock catalog or live openFDA records, then add
            drugs into your local inventory state for {pharmacy?.name ?? "your pharmacy"}.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <StatCard label="Listed drugs" value={stats.listedDrugs} />
          <StatCard label="Low stock" value={stats.lowStockCount} tone="amber" />
          <StatCard
            label="Inventory value"
            value={currencyFormatter(stats.totalValue)}
          />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Add drugs to inventory
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Search openFDA by brand name. Mock MedPin catalog results stay
                visible so you can keep building the flow without backend logic.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-700">
              <PackagePlus className="h-5 w-5" />
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search aspirin, ventolin, amoxicillin..."
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            openFDA lookup starts after 3 characters. Added rows remain local only.
          </div>

          <div className="mt-5 space-y-3">
            {searchState === "loading" ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <LoaderCircle className="h-4 w-4 animate-spin text-emerald-600" />
                Checking openFDA catalog...
              </div>
            ) : null}

            {searchState === "error" ? (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                openFDA could not be reached, so only mock MedPin catalog results are shown.
              </div>
            ) : null}

            {mergedResults.map((drug) => (
              <article
                key={drug.drugKey}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {drug.name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {drug.genericName || "Generic name unavailable"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {[drug.strength, drug.form, drug.status]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={drug.alreadyAdded}
                    onClick={() => handleAddDrug(drug)}
                    className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {drug.alreadyAdded ? "Added" : "Add to inventory"}
                  </button>
                </div>
              </article>
            ))}

            {mergedResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Start typing a drug name to search the catalog.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Current inventory
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This table is mock-data driven for now. Quantity and price edits
                update local component state only.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {pharmacy?.area ?? "Local"} branch
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden grid-cols-[2.1fr_1.4fr_0.9fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
              <span>Drug</span>
              <span>Strength / form</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-200">
              {inventoryItems.map((item) => (
                <div
                  key={item.inventoryId}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[2.1fr_1.4fr_0.9fr_1fr_1fr] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.genericName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-700">
                      {[item.strength, item.form].filter(Boolean).join(" • ")}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Updated {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <label className="block">
                    <span className="sr-only">Quantity</span>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) =>
                        handleInventoryChange(
                          item.inventoryId,
                          "quantity",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    />
                  </label>

                  <label className="block">
                    <span className="sr-only">Price</span>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(event) =>
                        handleInventoryChange(
                          item.inventoryId,
                          "unitPrice",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    />
                    <span className="mt-1 block text-xs text-slate-400">
                      {currencyFormatter(item.unitPrice)}
                    </span>
                  </label>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "in_stock"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "low_stock"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function StatCard({ label, value, tone = "emerald" }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-emerald-200 bg-white text-slate-900";

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

export default InventoryPage;
