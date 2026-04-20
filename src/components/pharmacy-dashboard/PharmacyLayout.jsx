import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  Package,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { mockPharmacyProfile } from "../../data/mock/dashboard.js";


const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", tab: "overview" },
  { icon: Pill, label: "Drug List", tab: "drugs" },
  { icon: Package, label: "My Stock", tab: "inventory" },
];

export default function PharmacyLayout({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <div className="min-h-screen bg-[#f4f9f6] text-slate-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4">
        Skip to main content
      </a>

      { }
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col items-center border-r border-slate-200 bg-[#F8FAFC] py-6 lg:flex"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500">
          <span className="text-sm font-black tracking-tight text-white">M</span>
        </div>

        {/* Main nav */}
        <nav className="flex flex-1 flex-col items-center gap-1 w-full">
          {NAV_ITEMS.map(({ icon: Icon, label, tab }) => {
            const isActive = activeTab === tab;
            return (
              <NavLink
                key={tab}
                to={`/pharmacy/dashboard?tab=${tab}`}
                title={label}
                className={`group relative flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-3.5 transition-colors duration-150 ${isActive ? "" : "hover:bg-slate-100"
                  }`}
              >
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[4px] rounded-l-full bg-emerald-500" />
                )}
                <Icon size={20} className={isActive ? "text-emerald-600" : "text-[#475569] group-hover:text-slate-800"} />
                <span className={`text-[10px] leading-none ${isActive ? "text-emerald-600 font-semibold" : "text-[#475569] group-hover:text-slate-800"}`}>
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Settings pinned to bottom */}
        <div className="w-full">
          <NavLink
            to="/pharmacy/dashboard?tab=settings"
            title="Settings"
            className={`group relative flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-3.5 transition-colors duration-150 ${activeTab === "settings" ? "" : "hover:bg-slate-100"
              }`}
          >
            {activeTab === "settings" && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[4px] rounded-l-full bg-emerald-500" />
            )}
            <Settings size={20} className={activeTab === "settings" ? "text-emerald-600" : "text-[#475569] group-hover:text-slate-800"} />
            <span className={`text-[10px] leading-none ${activeTab === "settings" ? "text-emerald-600 font-semibold" : "text-[#475569] group-hover:text-slate-800"}`}>
              Settings
            </span>
          </NavLink>
        </div>
      </aside>

      { }
      <div className="flex min-h-screen flex-col lg:ml-24">

        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div>
            <p className="text-[11px] text-slate-400">Hello,</p>
            <p className="text-sm font-semibold text-slate-800 leading-tight">{mockPharmacyProfile.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <button aria-label="Search" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Search size={16} />
            </button>
            <button aria-label="Notifications" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {mockPharmacyProfile.initials}
              </div>
              {/* Name hidden on small screens */}
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                {mockPharmacyProfile.name}
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-auto pb-20 focus:outline-none lg:pb-0">
          {children}
        </main>
      </div>

      { }
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white lg:hidden"
        aria-label="Mobile navigation"
      >
        {[...NAV_ITEMS, { icon: Settings, label: "Settings", tab: "settings" }].map(
          ({ icon: Icon, label, tab }) => {
            const isActive = activeTab === tab;
            return (
              <NavLink
                key={tab}
                to={`/pharmacy/dashboard?tab=${tab}`}
                className="flex flex-1 flex-col items-center gap-1 py-3 transition-colors"
              >
                <Icon size={20} className={isActive ? "text-emerald-500" : "text-slate-400"} />
                <span className={`text-[10px] leading-none font-medium ${isActive ? "text-emerald-500" : "text-slate-400"}`}>
                  {label}
                </span>
              </NavLink>
            );
          }
        )}
      </nav>
    </div>
  );
}
