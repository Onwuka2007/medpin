export const mockNotifications = [
  {
    id: 'notif-001',
    userId: 'user-urban-professional',
    type: 'stock_update',
    title: 'Ventolin is back in stock nearby',
    body: 'HealthPlus Pharmacy in Yaba now has Ventolin available.',
    isRead: false,
    createdAt: '2026-03-30T09:18:00+01:00',
    action: {
      label: 'View pharmacy',
      href: '/pharmacy/pharm-healthplus-yaba',
    },
  },
  {
    id: 'notif-002',
    userId: 'user-caregiver-1',
    type: 'price_alert',
    title: 'Paracetamol price dropped',
    body: 'MedCourt Pharmacy now lists Paracetamol 500mg at NGN 1,500.',
    isRead: true,
    createdAt: '2026-03-29T15:42:00+01:00',
    action: {
      label: 'Open result',
      href: '/search?q=paracetamol',
    },
  },
  {
    id: 'notif-003',
    userId: 'owner-healthplus',
    type: 'dashboard_alert',
    title: 'Low stock warning',
    body: 'Ventolin inhaler stock is low. Demand has increased 24% this week.',
    isRead: false,
    createdAt: '2026-03-30T08:55:00+01:00',
    action: {
      label: 'Open dashboard',
      href: '/partner/dashboard',
    },
  },
]
