import React, { useState } from "react"
import PageHeader from "../PageHeader.jsx"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  TriangleAlert,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { mockDashboardMetrics } from "../../../data/mock/dashboard.js"

/* ────────────────────────────────────────────────────────────
   OverviewTab  -  main dashboard insights view.

   Matches the reference image layout:
   ┌──────────┬──────────┬──────────┐   ← 3 KPI cards
   ├──────────────────────┬─────────┤
   │  Line chart          │ Category│   ← chart + category bars
   │  (searches/views)    │ bars    │
   ├──────────────────────┴─────────┤
   │  Most searched drugs list      │   ← bottom row
   └────────────────────────────────┘
──────────────────────────────────────────────────────────── */

const { kpiCards, chartPoints, stockByCategory, topSearchedDrug, mostSearchedDrugs, lowStockAlerts } =
  mockDashboardMetrics

/* Period options for the chart dropdown */
const PERIODS = ["Week", "Month", "Quarter", "Year"]

/* Custom recharts tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

export default function OverviewTab() {
  const [period, setPeriod] = useState("Quarter")

  return (
    <div className="space-y-5 p-4 sm:p-6">

      {/* ── Page heading ──────────────────────────────────── */}
      <PageHeader
        title="Dashboard"
        description={`Your pharmacy's performance snapshot - ${mockDashboardMetrics.thisWeek.searches.toLocaleString()} searches this week`}
      />

      {/* ── Row 1: KPI cards ──────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} card={card} />
        ))}
      </div>

      {/* ── Row 2: Chart + right panel ────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">

        {/* Line chart */}
        {/* flex-col + h-full so the chart fills the grid row height */}
        <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Searches by
            </h3>
            {/* Period selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* flex-1 + min-h-0 lets recharts ResponsiveContainer expand to fill remaining space */}
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartPoints} margin={{ top: 4, right: 16, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                {/* Primary line - searches (emerald) */}
                <Line
                  type="monotone"
                  dataKey="searches"
                  name="Searches"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#10b981" }}
                />
                {/* Secondary line - profile views (amber) */}
                <Line
                  type="monotone"
                  dataKey="profileViews"
                  name="Profile views"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                  activeDot={{ r: 5, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend - pinned to bottom of card */}
          <div className="mt-3 flex items-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-5 rounded-full bg-emerald-500" />
              Searches
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-5 rounded-full bg-amber-400" />
              Profile views
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">

          {/* Stock by category */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Total stock by category
            </h3>
            <div className="space-y-2.5">
              {stockByCategory.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-600">{item.category}</span>
                    <span className="font-medium text-slate-800">{item.count} items</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top searched drug - donut */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-800">
              Top Searched Drug
            </h3>
            <p className="mb-4 text-xs text-slate-400">{topSearchedDrug.quarterLabel}</p>

            {/* Ring chart - pure SVG, keeps it lightweight */}
            <div className="flex items-center gap-5">
              <DonutRing percentage={topSearchedDrug.percentage} />
              <div>
                <p className="text-sm font-semibold text-slate-800">{topSearchedDrug.name}</p>
                <p className="text-xs text-slate-500">{topSearchedDrug.category}</p>
                <p className="mt-1 text-xs text-emerald-700 font-medium">{topSearchedDrug.ageGroup}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Most searched + Low stock ──────────────── */}
      <div className="grid gap-4 xl:grid-cols-2">

        {/* Most searched drugs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Most Searched Drugs</h3>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="space-y-2">
            {mostSearchedDrugs.map((drug) => (
              <div
                key={drug.drugId}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{drug.label}</p>
                  <p className="text-xs text-slate-400">{drug.searches.toLocaleString()} searches</p>
                </div>
                <TrendChip trend={drug.trend} delta={drug.delta} />
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Low Stock Alerts</h3>
            <TriangleAlert size={16} className="text-amber-500" />
          </div>
          <div className="space-y-2">
            {lowStockAlerts.map((alert) => {
              const progress = Math.round((alert.currentQuantity / alert.recommendedRestockLevel) * 100)
              return (
                <div
                  key={alert.drugId}
                  className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{alert.label}</p>
                    <span className="text-xs font-semibold text-amber-700">
                      {alert.currentQuantity} / {alert.recommendedRestockLevel}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-amber-700">
                    Restock target: {alert.recommendedRestockLevel} units
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

/** KPI card matching the reference image style */
function KpiCard({ card }) {
  const TrendIcon = card.trend === "up" ? TrendingUp : card.trend === "down" ? TrendingDown : Minus
  const trendColor = card.trend === "up" ? "text-emerald-600" : card.trend === "down" ? "text-rose-500" : "text-slate-400"

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${
        card.highlight
          ? "border-emerald-400/30 bg-linear-to-br from-emerald-500 to-emerald-400 text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      {/* Subtle decorative blob */}
      {card.highlight && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      )}

      <p className={`text-xs font-semibold uppercase tracking-wider ${card.highlight ? "text-emerald-200" : "text-slate-500"}`}>
        {card.label}
      </p>

      {/* Big value + trend */}
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-3xl font-bold tracking-tight ${card.highlight ? "text-white" : "text-slate-900"}`}>
          {card.value}
        </p>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${card.highlight ? "text-emerald-200" : trendColor}`}>
          <TrendIcon size={14} />
          {card.trendValue}
        </span>
      </div>

      <p className={`mt-1 text-xs ${card.highlight ? "text-emerald-300" : "text-slate-400"}`}>
        {card.sub}
      </p>

      {/* Bottom row: sales vs target */}
      <div className={`mt-3 flex items-center gap-3 border-t pt-3 text-xs ${card.highlight ? "border-white/20 text-emerald-200" : "border-slate-100 text-slate-500"}`}>
        <span>
          <span className="font-semibold">{card.salesLabel}</span>
          {" "}
          <span className={card.highlight ? "text-white" : "text-slate-700"}>{card.salesValue}</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider opacity-60">target</span>
        <span className={card.highlight ? "text-white" : "text-slate-700"}>{card.targetValue}</span>
      </div>
    </article>
  )
}

/** Trend chip: up arrow green, down arrow red, flat grey */
function TrendChip({ trend, delta }) {
  if (trend === "up")   return <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"><TrendingUp size={11} />{delta}</span>
  if (trend === "down") return <span className="flex items-center gap-0.5 rounded-full bg-rose-50   px-2 py-0.5 text-xs font-semibold text-rose-600"><TrendingDown size={11} />{delta}</span>
  return <span className="flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500"><Minus size={11} />{delta}</span>
}

/** SVG donut ring */
function DonutRing({ percentage }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (percentage / 100) * circ

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        {/* Track */}
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
        {/* Fill */}
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-800">{percentage}%</span>
    </div>
  )
}
