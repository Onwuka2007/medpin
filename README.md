# MedPin

**MedPin** is a pharmacy finder and medication discovery platform built for the Nigerian market. It helps patients locate nearby pharmacies, check real-time drug availability, compare prices, and get AI-powered medication guidance — all in one place.

---

## Features

- **AI Drug Search** — Natural language search powered by Groq (LLaMA 3.1) that interprets drug names, brand names, generic forms, and even common misspellings
- **Pharmacy Locator** — Interactive map (Leaflet + OpenStreetMap) displaying nearby pharmacies with distance, hours, services, and delivery availability
- **Real-Time Inventory** — Browse drug stock status, unit pricing (NGN), and estimated delivery time across multiple pharmacy partners
- **Prescription Scanner** — AI assistant with image recognition to parse prescriptions and suggest available medications
- **Pharmacy Partner Portal** — Multi-step onboarding, inventory management dashboard, and analytics for pharmacy businesses
- **OpenFDA Integration** — Supplements local catalog with verified drug data from the FDA database
- **Location-Aware** — Uses the browser Geolocation API and Haversine distance calculation to rank results by proximity

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router v7, Vite |
| Styling | TailwindCSS 4, Radix UI, Class Variance Authority |
| AI / LLM | Groq API (llama-3.1-8b-instant) |
| Maps | Leaflet, React Leaflet, OpenStreetMap |
| Charts | Recharts |
| External APIs | OpenFDA, Google Maps (directions links) |
| Utilities | Lucide React, clsx, Tailwind Merge |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
git clone https://github.com/your-username/medpin.git
cd medpin
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Running Locally

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── pages/            # Route-level page components
├── components/       # Feature and UI components
│   ├── assistant/    # AI chat assistant
│   ├── map/          # Pharmacy map view
│   ├── search/       # Search results & filters
│   └── pharmacy-dashboard/  # Partner portal
├── services/         # Groq AI, search logic, OpenFDA API calls
├── data/mock/        # Pharmacy, drug, and inventory mock data
└── lib/              # Utilities (distance calc, search storage)
```

---

## Key Design Decisions

- **AI-first search with fuzzy fallback** — If the LLM returns no results, a scored string-matching algorithm (prefix, substring, synonym) ensures users always see relevant results
- **No backend required** — The app runs entirely in the browser using Vite + Groq's client SDK, making it fast to prototype and deploy
- **Nigeria-specific data model** — Pharmacies include NAFDAC status, NGN pricing, WhatsApp contact support, and Lagos/Abuja area metadata

---

## Screenshots

> *(Add screenshots here)*

---

## Roadmap

- [ ] Live backend with real pharmacy inventory sync
- [ ] User accounts and prescription history
- [ ] SMS/WhatsApp drug availability alerts
- [ ] Expand coverage beyond Lagos and Abuja

---

## License

MIT
