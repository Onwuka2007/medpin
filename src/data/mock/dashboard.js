export const mockDashboardMetrics = {
  pharmacyId: 'pharm-healthplus-yaba',
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
  demandForecast: [
    { drugId: 'drug-paracetamol-500-tablet', label: 'Paracetamol', trend: 'high', projectedDemand: 120 },
    { drugId: 'drug-ventolin-inhaler', label: 'Ventolin', trend: 'rising', projectedDemand: 42 },
    { drugId: 'drug-amatem-softgel', label: 'Amatem', trend: 'steady', projectedDemand: 35 },
  ],
  lowStockAlerts: [
    { drugId: 'drug-ventolin-inhaler', currentQuantity: 4, recommendedRestockLevel: 18 },
    { drugId: 'drug-postinor-2-tablet', currentQuantity: 2, recommendedRestockLevel: 12 },
  ],
  chartPoints: [
    { day: 'Mon', searches: 120, purchasesIntent: 36 },
    { day: 'Tue', searches: 148, purchasesIntent: 41 },
    { day: 'Wed', searches: 160, purchasesIntent: 47 },
    { day: 'Thu', searches: 171, purchasesIntent: 49 },
    { day: 'Fri', searches: 190, purchasesIntent: 54 },
    { day: 'Sat', searches: 210, purchasesIntent: 63 },
    { day: 'Sun', searches: 183, purchasesIntent: 52 },
  ],
}
