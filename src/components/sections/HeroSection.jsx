const pharmacies = [
  {
    name: 'HealthBridge Pharmacy',
    area: 'Yaba, Lagos',
    eta: '6 mins away',
    stock: 'In stock',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    name: 'MediCare Point',
    area: 'Surulere, Lagos',
    eta: '12 mins away',
    stock: 'Low stock',
    tone: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  {
    name: 'Alpha Pharmacy',
    area: 'Ikeja, Lagos',
    eta: '18 mins away',
    stock: 'Open now',
    tone: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
]

function HeroSection() {
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-16 pt-6 lg:px-10 lg:pb-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-2xl pt-4 lg:pt-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/85 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_18px_45px_rgba(148,163,184,0.14)] backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Verified pharmacy inventory near you
          </div>

          <h1 className="mt-7 max-w-xl font-['Space_Grotesk',sans-serif] text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Find the right drug before you leave the house.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            Search a medicine, compare nearby pharmacies, and get trusted availability
            signals in one calm flow built for Nigerian cities.
          </p>

          <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_30px_80px_rgba(148,163,184,0.22)] backdrop-blur">
            <div className="grid gap-3 md:grid-cols-[1.25fr_0.8fr_auto]">
              <label className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Drug
                </span>
                <input
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Search Paracetamol, Amatem, Ventolin..."
                  type="text"
                />
              </label>

              <label className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Location
                </span>
                <input
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Yaba, Lagos"
                  type="text"
                />
              </label>

              <button className="rounded-[1.4rem] bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                Search now
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">Open now</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">Within 5km</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">Alternative suggestions</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <div>
              <span className="block font-['Space_Grotesk',sans-serif] text-2xl font-semibold text-slate-950">
                120+
              </span>
              Partner pharmacies
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="block font-['Space_Grotesk',sans-serif] text-2xl font-semibold text-slate-950">
                10k+
              </span>
              Searchable drug records
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="block font-['Space_Grotesk',sans-serif] text-2xl font-semibold text-slate-950">
                Real-time
              </span>
              Availability updates
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-14 hidden h-24 w-24 rounded-full bg-sky-200/40 blur-3xl lg:block" />
          <div className="absolute -right-6 bottom-0 hidden h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl lg:block" />

          <div className="relative rounded-[2.5rem] border border-white/75 bg-white/80 p-5 shadow-[0_32px_90px_rgba(148,163,184,0.22)] backdrop-blur">
            <div className="rounded-[2rem] bg-[linear-gradient(160deg,#eff6ff_0%,#f8fafc_42%,#ecfeff_100%)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Search preview</p>
                  <h2 className="mt-1 font-['Space_Grotesk',sans-serif] text-2xl font-semibold text-slate-950">
                    Paracetamol 500mg
                  </h2>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                  Yaba
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                {pharmacies.map((pharmacy) => (
                  <article
                    key={pharmacy.name}
                    className="rounded-[1.7rem] border border-white/80 bg-white p-4 shadow-[0_18px_45px_rgba(148,163,184,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{pharmacy.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{pharmacy.area}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${pharmacy.tone}`}>
                        {pharmacy.stock}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                          +
                        </span>
                        {pharmacy.eta}
                      </div>
                      <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800">
                        View pharmacy
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.7rem] bg-slate-950 p-5 text-white">
                  <p className="text-sm text-slate-300">AI suggestion</p>
                  <p className="mt-3 text-lg font-semibold">
                    Similar options available nearby if this exact brand is unavailable.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Use suggestions as discussion prompts with a pharmacist before buying.
                  </p>
                </div>

                <div className="rounded-[1.7rem] border border-dashed border-sky-200 bg-sky-50/70 p-5">
                  <p className="text-sm font-medium text-slate-500">Coverage snapshot</p>
                  <div className="mt-4 flex items-end gap-3">
                    <div className="h-16 w-10 rounded-t-2xl bg-sky-300" />
                    <div className="h-24 w-10 rounded-t-2xl bg-sky-400" />
                    <div className="h-20 w-10 rounded-t-2xl bg-emerald-300" />
                    <div className="h-28 w-10 rounded-t-2xl bg-slate-900" />
                    <div className="h-14 w-10 rounded-t-2xl bg-slate-200" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Inventory signals from partner pharmacies help users see where supply is strongest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
