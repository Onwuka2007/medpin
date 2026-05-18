import { NavLink } from "react-router-dom";
import { Bell, LayoutDashboard, Search, ShieldCheck } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f9f6] text-slate-900">
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col items-center border-r border-slate-200 bg-[#F8FAFC] py-6 lg:flex"
        aria-label="Admin navigation"
      >
        <div className="mb-10 flex h-10 w-10 items-center justify-center">
          <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1 w-full">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `group relative flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-3.5 transition-colors duration-150 ${isActive ? "" : "hover:bg-slate-100"}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 h-8 w-[4px] -translate-y-1/2 rounded-l-full bg-emerald-500" />
                  )}
                  <Icon size={20} className={isActive ? "text-emerald-600" : "text-[#475569] group-hover:text-slate-800"} />
                  <span className={`text-[10px] leading-none ${isActive ? "font-semibold text-emerald-600" : "text-[#475569] group-hover:text-slate-800"}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col lg:ml-24">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div>
            <p className="text-[11px] text-slate-400">Admin</p>
            <p className="text-sm font-semibold leading-tight text-slate-800">MedPin Console</p>
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
                AD
              </div>
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white lg:hidden"
        aria-label="Mobile admin navigation"
      >
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} className="flex flex-1 flex-col items-center gap-1 py-3 transition-colors">
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? "text-emerald-500" : "text-slate-400"} />
                <span className={`text-[10px] font-medium leading-none ${isActive ? "text-emerald-500" : "text-slate-400"}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
