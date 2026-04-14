import { Link } from "react-router-dom"
import {
  Search,
  MapPin,
  CheckCircle2,
  FileSearch,
  PackageSearch,
  ScanLine,
  ArrowRight,
  Clock3,
  SearchX,
  ShieldCheck,
  Stethoscope,
  Truck,
  Star,
} from "lucide-react"
import Navbar from "../components/hero/Navbar.jsx"
import SiteFooter from "../components/layout/SiteFooter.jsx"
import { Button } from "../components/ui/button.jsx"

/* ────────────────────────────────────────────────────────────
   HowItWorksPage - explains the MedPin product end-to-end.
──────────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Search for your medication",
    description:
      "Type the drug name, brand, or generic. MedPin searches across thousands of listed drugs - including alternatives if your exact brand isn't available.",
    detail: "Supports generic names, brand names, and common synonyms.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Find pharmacies near you",
    description:
      "See which verified pharmacies in your city have your drug in stock right now - with pricing, opening hours, and distance.",
    detail: "Available in Lagos, Abuja, Port Harcourt, and growing.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Confirm and go",
    description:
      "Call or WhatsApp the pharmacy to confirm, then walk in or request delivery. No more wasted trips or surprises at the counter.",
    detail: "All listed pharmacies are PCN-verified and regularly audited.",
  },
]

const FEATURES = [
  {
    icon: SearchX,
    heading: "Can't find your specific brand?",
    copy: "MedPin shows stocked options and suggests a verified generic alternative so you're never left empty-handed.",
  },
  {
    icon: Clock3,
    heading: "Tired of calling 20 pharmacies?",
    copy: "Check live stock across Lagos, Abuja, and Port Harcourt without picking up the phone.",
  },
  {
    icon: Stethoscope,
    heading: 'Told to "check around" by your doctor?',
    copy: "We connect your prescription to the nearest pharmacies that actually have it in stock.",
  },
  {
    icon: ShieldCheck,
    heading: "Worried about fluctuating costs?",
    copy: "Compare pharmacy prices before you leave home and avoid surprises at the counter.",
  },
  {
    icon: Truck,
    heading: "Need it delivered?",
    copy: "Filter for pharmacies that offer home delivery and get your medication without leaving the house.",
  },
  {
    icon: Star,
    heading: "Verified, trusted pharmacies only",
    copy: "Every pharmacy on MedPin holds a valid PCN licence. Unverified listings are never shown to patients.",
  },
]

const ASSISTANT_TOOLS = [
  {
    icon: FileSearch,
    title: "Scan a doctor's scribble",
    description:
      "Upload a photo of a handwritten prescription. Our AI reads it and extracts the drug names - even messy handwriting.",
  },
  {
    icon: PackageSearch,
    title: "Scan a drug pack",
    description:
      "Point your camera at a drug pack or label. MedPin identifies the name and strength instantly.",
  },
  {
    icon: ScanLine,
    title: "AI medication assistant",
    description:
      "Ask anything about a drug - dosage, interactions, storage, generics. Get clear, pharmacist-level answers in seconds.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f8fbf8] text-slate-900">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="bg-[#1f5649] pb-20 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
            How MedPin works
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Find your medication in three simple steps
          </h1>
          <p className="mt-4 text-sm leading-7 text-emerald-200 sm:text-base">
            MedPin connects patients across Nigeria to verified pharmacies with live stock -
            so you never waste a trip or overpay for essential medication.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-[#1f5649] hover:bg-emerald-50">
              <Link to="/">Search a drug</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10">
              <Link to="/pharmacies">Browse pharmacies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 3-step process ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative flex flex-col">
                {/* Connector line between steps */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-full top-8 hidden w-8 border-t-2 border-dashed border-slate-200 md:block" />
                )}

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <Icon size={24} className="text-emerald-600" />
                </div>

                <p className="mt-4 text-4xl font-black tracking-tight text-slate-100">{step.number}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
                <p className="mt-3 text-xs text-emerald-600">{step.detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Why MedPin / feature grid ───────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7a938a]">
              Why patients choose MedPin
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#173f36] sm:text-4xl">
              We've simplified medication search for thousands of Nigerians.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <article
                  key={f.heading}
                  className="group rounded-2xl border border-[#dbe7e0] bg-white p-6 shadow-sm transition hover:border-[#c9ddd4] hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef6f1] text-[#1f5649] transition group-hover:bg-[#1f5649] group-hover:text-white">
                    <Icon size={20} strokeWidth={2.1} />
                  </div>
                  <h3 className="mt-4 font-semibold text-[#173f36]">{f.heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#58766c]">{f.copy}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AI assistant tools ───────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7a938a]">
              Powered by AI
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#173f36] sm:text-4xl">
              Can't read the prescription? We can.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              MedPin's AI assistant handles the hard parts - reading messy handwriting,
              identifying drug packs, and answering medication questions.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {ASSISTANT_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <Icon size={20} className="text-emerald-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-800">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1f5649_0%,#173f36_48%,#102a23_100%)] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to find your medication?
            </h2>
            <p className="max-w-md text-sm leading-6 text-emerald-200">
              Search thousands of drugs, compare nearby pharmacies, and never waste a trip again.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-[#1f5649] hover:bg-emerald-50">
                <Link to="/">
                  Find a drug <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10">
                <Link to="/pharmacies">Browse pharmacies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
