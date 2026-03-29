function SiteHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]">
            MP
          </div>
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-lg font-semibold tracking-tight text-slate-950">
              MedPin
            </p>
            <p className="text-sm text-slate-500">Pharmacy finder for faster access</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 rounded-full border border-white/70 bg-white/70 px-6 py-3 text-sm font-medium text-slate-600 shadow-[0_12px_40px_rgba(148,163,184,0.16)] backdrop-blur md:flex">
          <a href="#how-it-works" className="transition hover:text-slate-950">
            How it works
          </a>
          <a href="#pharmacies" className="transition hover:text-slate-950">
            Pharmacies
          </a>
          <a href="#insights" className="transition hover:text-slate-950">
            AI insights
          </a>
        </nav>

        <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_30px_rgba(148,163,184,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(148,163,184,0.24)]">
          Partner with MedPin
        </button>
      </div>
    </header>
  )
}

export default SiteHeader
