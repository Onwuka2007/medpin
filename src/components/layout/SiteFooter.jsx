import Logo from "../ui/Logo.jsx"

function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(31,86,73,0.08)] bg-white px-6 pb-8 pt-8 text-(--color-foreground) sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-7 text-[#648277]">
              MedPin helps people find nearby pharmacies with the drugs they
              need, compare availability, and move faster when a medicine is
              urgent.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#799188]">
              Product
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#4f6d62]">
              <a
                href="#find-pharmacies"
                className="transition hover:text-(--color-primary)"
              >
                Find pharmacies
              </a>
              <a
                href="#how-it-works"
                className="transition hover:text-(--color-primary)"
              >
                How it works
              </a>
              <a
                href="#support"
                className="transition hover:text-(--color-primary)"
              >
                Support
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#799188]">
              Contact
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#4f6d62]">
              <p>hello@medpin.app</p>
              <p>Lagos, Nigeria</p>
              <p>Built for pharmacies and everyday medicine access</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 text-sm text-[#789088] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 MedPin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
