# MedPin — AI Audit Report

**Date:** 2026-04-14  
**Auditor:** Claude Sonnet 4.6 (AI-assisted review)  
**Scope:** Full frontend shell — dashboard redesign + whole-app audit

---

## 1. What Was Changed in This Session

### 1.1 New Packages Installed

| Package | Purpose |
|---------|---------|
| `recharts` | Line chart and data visualisation in OverviewTab |
| `@radix-ui/react-dialog` | Accessible modal primitive for StockUpdateModal |
| `@radix-ui/react-select` | Accessible select/dropdown for filter controls |
| `@radix-ui/react-slot` | Required peer for shadcn-style Slot pattern |

### 1.2 New / Replaced Files

| File | Change | Notes |
|------|--------|-------|
| `src/App.jsx` | **Replaced** | Single `/pharmacy/dashboard` route; removed `/pharmacy/dashboard/inventory` |
| `src/pages/PharmacyDashboardPage.jsx` | **Created** | Tab-router shell; holds shared inventory state |
| `src/components/pharmacy-dashboard/PharmacyLayout.jsx` | **Replaced** | Icon-only dark sidebar + top header bar |
| `src/components/pharmacy-dashboard/tabs/OverviewTab.jsx` | **Created** | Dashboard insights: KPI cards, line chart, category bars, donut, drug list |
| `src/components/pharmacy-dashboard/tabs/DrugListTab.jsx` | **Created** | Filterable drug catalogue table (shadcn Table) |
| `src/components/pharmacy-dashboard/tabs/InventoryTab.jsx` | **Created** | Pharmacy stock table with edit modal |
| `src/components/pharmacy-dashboard/StockUpdateModal.jsx` | **Created** | Reusable Radix Dialog for add/edit stock |
| `src/components/ui/table.jsx` | **Created** | Shadcn-style Table components |
| `src/components/ui/dialog.jsx` | **Created** | Shadcn-style Dialog components |
| `src/components/ui/badge.jsx` | **Created** | Shadcn-style Badge with status variants |
| `src/components/ui/input.jsx` | **Created** | Shadcn-style Input |
| `src/components/ui/select.jsx` | **Created** | Shadcn-style Select (Radix-based) |
| `src/data/mock/dashboard.js` | **Enriched** | Added KPI cards, chart data, category bars, top drug, searched drugs list |
| `vite.config.js` | **Updated** | Added `@/` path alias pointing to `src/` |

### 1.3 Deleted Files

| File | Reason |
|------|--------|
| `src/components/pharmacy-dashboard/OverviewPage.jsx` | Replaced by `OverviewTab.jsx` |
| `src/components/pharmacy-dashboard/InventoryPage.jsx` | Replaced by `InventoryTab.jsx` + `DrugListTab.jsx` |

---

## 2. Dashboard Architecture

### Tab Routing Pattern

```
/pharmacy/dashboard                → defaults to ?tab=overview
/pharmacy/dashboard?tab=overview   → OverviewTab (insights)
/pharmacy/dashboard?tab=drugs      → DrugListTab (drug catalogue)
/pharmacy/dashboard?tab=inventory  → InventoryTab (pharmacy stock)
```

Routing uses React Router's `useSearchParams`. The `PharmacyDashboardPage` reads the query param and conditionally renders the active tab. The sidebar icons each navigate to the correct `?tab=` URL, keeping sidebar highlight in sync.

### Shared State Pattern

Inventory state (`inventoryItems`) lives in `PharmacyDashboardPage` (the shell). Both `DrugListTab` (writes via `onAddToInventory`) and `InventoryTab` (reads and edits via `onUpdate`) share the same array. This is the blueprint for the real API — one inventory endpoint, two views.

### Mock Data Blueprint

The shapes in `dashboard.js` and `inventory.js` define what the backend API should return:

- `mockPharmacyProfile` → `GET /pharmacy/:id/profile`
- `mockDashboardMetrics.kpiCards` → `GET /pharmacy/:id/dashboard/kpis`
- `mockDashboardMetrics.chartPoints` → `GET /pharmacy/:id/dashboard/chart?period=quarter`
- `mockDashboardMetrics.stockByCategory` → `GET /pharmacy/:id/dashboard/category-breakdown`
- `mockDashboardMetrics.mostSearchedDrugs` → `GET /pharmacy/:id/dashboard/top-searches`
- `mockInventory` (filtered by pharmacyId) → `GET /pharmacy/:id/inventory`
- `mockDrugs` → `GET /drugs` (drug catalogue)

---

## 3. Whole-App Audit

### 3.1 Architecture & File Structure

**Rating: Good**

- Clean separation: `pages/` (route components), `components/` (UI), `services/` (business logic), `data/mock/` (dummy data), `lib/` (utilities).
- The `pharmacy-dashboard/` folder is now logically organised with a `tabs/` sub-folder.
- `src/lib/utils.js` provides `cn()` shared by all UI components — consistent pattern.

**Suggestions for backend phase:**
- Move all `data/mock/` calls into `services/` as real API calls. The mock files should be removed or replaced by API client modules.
- Consider a `contexts/` folder for global state (auth, pharmacy profile) once auth is introduced.

---

### 3.2 Routing

**Rating: Good**

| Route | Component | Status |
|-------|-----------|--------|
| `/` | HomePage | Public landing page |
| `/search` | SearchPage | Drug search results |
| `/pharmacy/dashboard?tab=*` | PharmacyDashboardPage | Pharmacy portal |

**Notes:**
- Currently no route protection (no auth). When auth is added, `/pharmacy/dashboard` needs a `<ProtectedRoute>` wrapper.
- `/pharmacy/dashboard/inventory` (old route) is removed. Any bookmarks or links to it will show a blank page — ensure they are updated.

---

### 3.3 Drug Search (User-facing)

**Rating: Good**

- AI-powered query correction via Groq (`llama-3.1-8b-instant`) with graceful fallback to local search.
- Haversine distance calculation correctly sorts pharmacies by proximity.
- OpenFDA service used for real drug lookups (inventory page, now drug list tab).
- `VITE_GROQ_API_KEY` must be set in `.env` for AI features to work.

**Watch out:**
- The Groq API key is used client-side, which exposes it to end users. For production, this should move to a backend proxy endpoint.
- `searchStorage.js` uses `localStorage` — no TTL or cleanup logic. Stale location data will persist indefinitely.

---

### 3.4 Dummy Data Quality

**Rating: Good**

- 10 drugs, 5 pharmacies, 22 inventory records, rich dashboard metrics — sufficient for UI review.
- All Nigerian pharmacy context: NGN currency, Lagos + Abuja locations, NAFDAC status, local brand names.
- Drug IDs follow a consistent slug pattern (`drug-name-strength-form`) — easy to key off.
- Pharmacy IDs follow `pharm-name-area` — same pattern.
- `CURRENT_PHARMACY_ID = "pharm-alpha-mainland"` is hardcoded in 2 places — consolidate to a single constant or context when auth is added.

---

### 3.5 UI / Component Quality

**Rating: Good**

- Consistent `cn()` usage with Tailwind classes — no inline style clashes.
- shadcn-style components built on Radix UI primitives: accessible by default (ARIA roles, keyboard nav).
- `DM Sans` font applied globally via `index.css` — consistent with design.
- Color palette strictly follows `--color-primary: #1f5649` teal system.
- Lucide icons used consistently throughout (no mixed icon libraries).

**Minor issues:**
- `lucide-react` version `^1.7.0` is unusually high — verify this is the correct package version and not a typo. Normal version is `~0.4xx`. *(No functional impact seen.)*
- The `Cherry Cream Soda` font is imported but appears unused outside the logo area — consider removing the import if not needed to reduce page load.

---

### 3.6 State Management

**Rating: Appropriate for shell phase**

- Local `useState` used everywhere — correct for a no-backend shell.
- Shared inventory state elevated to `PharmacyDashboardPage` — clean prop-drilling for 2 levels.
- No global state library (Redux, Zustand, Context) — not needed yet.

**For backend phase:** Replace local state with a data-fetching layer (React Query / SWR recommended). Inventory edits should optimistically update local state and sync to the API.

---

### 3.7 Performance

**Rating: Good for shell**

- `useMemo` correctly used for filtered lists and derived stats in all table views.
- `recharts` `ResponsiveContainer` used — chart is responsive and won't cause layout overflow.
- No unnecessary re-renders observed in component structure.
- Leaflet map (on SearchPage) loads lazily due to react-leaflet — no impact on dashboard route.

---

### 3.8 Accessibility

**Rating: Mostly Good**

- Skip link present in `PharmacyLayout`.
- All icon buttons have `aria-label`.
- Radix Dialog and Select are fully keyboard-navigable.
- Table uses semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements.

**Gaps:**
- Table rows in `DrugListTab` that are clickable (`onClick`) should also have `role="button"` and `tabIndex={0}` with `onKeyDown` support for keyboard users.
- Modal focus trap is handled by Radix Dialog automatically — no issue there.

---

### 3.9 Security (Frontend Shell Context)

**Rating: Acceptable for shell; needs hardening for production**

| Risk | Status |
|------|--------|
| Groq API key exposed client-side | Present — move to backend proxy before launch |
| No authentication on pharmacy routes | Intentional for shell phase — add `ProtectedRoute` with auth |
| No input sanitisation on search | Low risk (client-only, no SQL/XSS surface in shell) |
| localStorage usage | No sensitive data stored — safe for now |

---

## 4. Recommended Next Steps (Priority Order)

1. **Auth layer** — Add pharmacy login (JWT or session). Wrap `/pharmacy/dashboard` with `ProtectedRoute`. Replace `CURRENT_PHARMACY_ID` hardcode with authenticated pharmacy context.
2. **Backend API** — Wire the 6 dashboard endpoints described in §2. Replace mock data imports with API calls.
3. **Groq proxy** — Move AI search to a server-side route to protect the API key.
4. **OpenFDA in Drug List tab** — The `DrugListTab` currently shows only mock drugs. The OpenFDA lookup from the old `InventoryPage` should be ported in here.
5. **Keyboard accessibility** — Add `tabIndex`, `role`, `onKeyDown` to clickable table rows.
6. **Error boundaries** — Wrap `PharmacyDashboardPage` and `SearchPage` with a React error boundary to prevent full-page crashes.
7. **localStorage TTL** — Add an expiry to saved search location in `searchStorage.js`.

---

*Report generated by Claude Sonnet 4.6 as part of the MedPin frontend shell review.*
