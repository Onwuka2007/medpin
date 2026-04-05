import React from "react";

const InventoryPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Stock Management
          </h2>
          <p className="text-slate-500">
            Update your drug availability and pricing for local users.
          </p>
        </div>
        <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
          Add New Drug
        </button>
      </header>

      {/* Placeholder for your Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-12 text-center text-slate-400">
          Inventory table and EMDEX integration will render here.
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
