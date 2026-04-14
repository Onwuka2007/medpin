/* ────────────────────────────────────────────────────────────
   dashboard.js  -  Mock data for the Pharmacy Dashboard
   All shapes here serve as the blueprint for the real API.
   No backend logic; values are representative dummy data.
──────────────────────────────────────────────────────────── */

export const mockPharmacyProfile = {
  id: 'pharm-alpha-mainland',
  name: 'Alpha Pharmacy',
  location: 'Mainland, Lagos',
  initials: 'AP',
}

/* ── Today's snapshot metrics ─────────────────────────── */
export const mockDashboardMetrics = {
  pharmacyId: 'pharm-alpha-mainland',

  today: {
    searches: 184,
    profileViews: 92,
    walkInRequests: 38,
    stockUpdates: 7,
  },

  thisWeek: {
    searches: 1182,
    profileViews: 641,
    walkInRequests: 243,
    fulfilledOrders: 57,
  },

  /* Hero KPI cards - shown at top of dashboard overview */
  kpiCards: [
    {
      id: 'no-rx-drugs',
      label: 'OTC Drugs Listed',
      value: '67.01%',            // % of inventory that is non-prescription
      raw: 67.01,
      trend: 'up',               // 'up' | 'down' | 'flat'
      trendValue: '+3.2%',
      sub: 'Quarter 1, 2024',
      salesLabel: 'SEARCHES',
      salesValue: '57,567K',
      targetValue: '54,567K',
      highlight: true,           // first card gets primary colour treatment
    },
    {
      id: 'rx-drugs',
      label: 'Prescription Drugs',
      value: '27.45%',
      raw: 27.45,
      trend: 'up',
      trendValue: '+1.8%',
      sub: 'Quarter 1, 2024',
      salesLabel: 'SEARCHES',
      salesValue: '39,211K',
      targetValue: '37,562K',
      highlight: false,
    },
    {
      id: 'supplements',
      label: 'Supplements',
      value: '06.08%',
      raw: 6.08,
      trend: 'down',
      trendValue: '-0.4%',
      sub: 'Quarter 1, 2024',
      salesLabel: 'SEARCHES',
      salesValue: '27,213K',
      targetValue: '26,561K',
      highlight: false,
    },
  ],

  /* Weekly search + intent chart data */
  chartPoints: [
    { day: 'Jan', label: '01.2024', searches: 120, profileViews: 36 },
    { day: 'Feb', label: '02.2024', searches: 148, profileViews: 41 },
    { day: 'Mar', label: '03.2024', searches: 160, profileViews: 47 },
    { day: 'Apr', label: '04.2024', searches: 171, profileViews: 49 },
    { day: 'May', label: '05.2024', searches: 190, profileViews: 54 },
    { day: 'Jun', label: '06.2024', searches: 112, profileViews: 28 },
    { day: 'Jul', label: '07.2024', searches: 183, profileViews: 52 },
    { day: 'Aug', label: '08.2024', searches: 210, profileViews: 63 },
    { day: 'Sep', label: '09.2024', searches: 198, profileViews: 58 },
    { day: 'Oct', label: '10.2024', searches: 230, profileViews: 70 },
    { day: 'Nov', label: '11.2024', searches: 215, profileViews: 64 },
    { day: 'Dec', label: '12.2024', searches: 245, profileViews: 78 },
  ],

  /* Stock breakdown by drug category (right-panel bars) */
  stockByCategory: [
    { category: 'Pain Relief',          count: 14, percentage: 82 },
    { category: 'Antimalarials',        count: 8,  percentage: 65 },
    { category: 'Antibiotics',          count: 6,  percentage: 54 },
    { category: 'Respiratory',          count: 5,  percentage: 43 },
    { category: 'Women\'s Health',      count: 4,  percentage: 35 },
    { category: 'Hydration & Vitamins', count: 3,  percentage: 22 },
  ],

  /* Top searched drug - donut/ring panel */
  topSearchedDrug: {
    name: 'Paracetamol',
    category: 'Pain Relief',
    ageGroup: '35–45 years',
    percentage: 40,             // share of all searches this quarter
    quarterLabel: 'Quarter 1–Q3, 2024',
  },

  /* Most searched drugs list */
  mostSearchedDrugs: [
    { drugId: 'drug-paracetamol-500-tablet', label: 'Paracetamol',   searches: 1840, trend: 'up',   delta: '+12%' },
    { drugId: 'drug-amatem-softgel',         label: 'Amatem',        searches: 960,  trend: 'up',   delta: '+8%'  },
    { drugId: 'drug-amoxicillin-500-capsule',label: 'Amoxicillin',   searches: 720,  trend: 'flat', delta: '0%'   },
    { drugId: 'drug-ventolin-inhaler',        label: 'Ventolin',      searches: 540,  trend: 'up',   delta: '+5%'  },
    { drugId: 'drug-ibuprofen-200-capsule',  label: 'Ibuprofen',     searches: 410,  trend: 'down', delta: '-3%'  },
  ],

  /* Low stock alerts */
  lowStockAlerts: [
    { drugId: 'drug-ventolin-inhaler',   label: 'Ventolin',   currentQuantity: 4,  recommendedRestockLevel: 18 },
    { drugId: 'drug-postinor-2-tablet',  label: 'Postinor-2', currentQuantity: 2,  recommendedRestockLevel: 12 },
    { drugId: 'drug-amatem-softgel',     label: 'Amatem',     currentQuantity: 3,  recommendedRestockLevel: 20 },
  ],
}
