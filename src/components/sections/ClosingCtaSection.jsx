import { Button } from "../ui/button.jsx"

function ClosingCtaSection() {
  return (
    <section className="bg-white px-3 pb-12 pt-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-4xl border border-[rgba(31,86,73,0.08)] bg-[linear-gradient(135deg,#1f5649_0%,#173f36_48%,#102a23_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(31,86,73,0.16)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/68">
                Ready to use MedPin
              </p>
              <h2 className="mt-3 max-w-[14ch] text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[2.8rem]">
                Find the drug you need before leaving home.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                Search medicines, compare nearby pharmacies, and scan a
                prescription or drug pack when you need a faster way to start.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button
                asChild
                variant="default"
              >
                <a href="#find-drug">Find a drug</a>
              </Button>
              <Button
                type="button"
                variant="ghost"
              >
                Partner with MedPin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClosingCtaSection
