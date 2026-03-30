export const mockAiResponses = [
  {
    id: 'ai-alt-paracetamol',
    type: 'alternative_suggestion',
    triggerDrugId: 'drug-paracetamol-500-tablet',
    title: 'Possible alternatives to ask a pharmacist about',
    summary:
      'If your preferred paracetamol brand is unavailable, another paracetamol brand or ibuprofen may be available depending on your needs.',
    disclaimer:
      'These suggestions are for discussion with a pharmacist or doctor and are not direct medical instructions.',
    recommendationDrugIds: ['drug-paracetamol-500-tablet', 'drug-ibuprofen-200-capsule'],
  },
  {
    id: 'ai-alt-ventolin',
    type: 'alternative_suggestion',
    triggerDrugId: 'drug-ventolin-inhaler',
    title: 'Alternative inhaler option available nearby',
    summary:
      'Some pharmacies may carry a generic salbutamol inhaler when Ventolin is unavailable.',
    disclaimer:
      'Inhaler substitutions should be confirmed with a pharmacist, especially for active treatment plans.',
    recommendationDrugIds: ['drug-salbutamol-inhaler-generic'],
  },
  {
    id: 'ai-alt-amatem',
    type: 'alternative_suggestion',
    triggerDrugId: 'drug-amatem-softgel',
    title: 'Alternative malaria treatment brand',
    summary:
      'Some nearby pharmacies may carry Coartem, which contains the same active drug combination.',
    disclaimer:
      'Confirm suitability and dosing with a healthcare professional before purchase.',
    recommendationDrugIds: ['drug-coartem-20-120-tablet'],
  },
  {
    id: 'ai-search-help',
    type: 'search_assist',
    triggerDrugId: null,
    title: 'Search smarter with brand, generic, or symptom terms',
    summary:
      'You can search by brand name, generic name, or common terms. MedPin can also suggest corrections for misspellings.',
    disclaimer:
      'Search suggestions are for discovery and do not replace professional advice.',
    recommendationDrugIds: [],
  },
]
