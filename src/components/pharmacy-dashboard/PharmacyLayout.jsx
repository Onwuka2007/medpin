import React from "react";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";

const PharmacyLayout = ({ children, pharmacyName = "MedPlus Ikeja" }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
      >
        Skip to main content
      </a>

      {/* 2. Sidebar Navigation */}
      <aside
        className="w-64 border-r border-slate-200 bg-white"
        aria-label="Main Navigation"
      >
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <span className="text-xl font-bold tracking-tight text-emerald-600">
            MedPin
          </span>
          <span className="ml-1 text-xs font-medium text-slate-400">PRO</span>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active
          />
          <NavItem icon={<Package size={20} />} label="Inventory" />
          <NavItem icon={<BarChart3 size={20} />} label="Demand AI" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* 3. Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Pharmacy Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {pharmacyName[0]}
            </div>
          </div>
        </header>

        {/* 4. The "Children" Slot */}
        <main id="main-content" className="flex-1 p-8 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper Nav Component
const NavItem = ({ icon, label, active = false }) => (
  <a
    href="#"
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    {label}
  </a>
);

export default PharmacyLayout;
