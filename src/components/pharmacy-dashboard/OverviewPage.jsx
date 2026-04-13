import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TriangleAlert } from "lucide-react";
import { mockDashboardMetrics } from "../../data/mock/index.js";

const OverviewPage = () => {
  const metrics = [
    { label: "Searches today", value: mockDashboardMetrics.today.searches },
    { label: "Profile views", value: mockDashboardMetrics.today.profileViews },
    {
      label: "Walk-in requests",
      value: mockDashboardMetrics.today.walkInRequests,
    },
    { label: "Stock updates", value: mockDashboardMetrics.today.stockUpdates },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-emerald-100 bg-linear-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Dashboard overview
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              What needs attention today
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Track demand, spot low stock early, and jump into the inventory
              flow to keep your shelf data accurate.
            </p>
          </div>

          <Link
            to="/pharmacy/dashboard/inventory"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Open inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Demand AI watchlist
              </h3>
              <p className="text-sm text-slate-500">
                Drugs with the strongest near-term search momentum.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {mockDashboardMetrics.demandForecast.map((item) => (
              <article
                key={item.drugId}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Trend: {item.trend}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-700">
                  {item.projectedDemand} projected
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-50 p-2 text-amber-700">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Low stock alerts
              </h3>
              <p className="text-sm text-slate-500">
                Priority items to restock before demand slips.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {mockDashboardMetrics.lowStockAlerts.map((item) => (
              <article
                key={item.drugId}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.drugId.replace("drug-", "").replaceAll("-", " ")}
                </p>
                <p className="mt-1 text-sm text-amber-900">
                  {item.currentQuantity} left, restock target{" "}
                  {item.recommendedRestockLevel}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;
