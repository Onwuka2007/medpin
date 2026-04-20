import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo.jsx";
import { Link } from "react-router-dom";
import { Button } from "../ui/button.jsx";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-[rgba(31,86,73,0.08)] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-8 md:py-3 lg:px-10">
        <div tabIndex="0">
          <Logo />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium text-[#3b6458] lg:flex">
          <Link to="/how-it-works" className="transition hover:text-[#1f5649]">
            How it works
          </Link>
          <Link to="/pharmacies" className="transition hover:text-[#1f5649]">
            Find pharmacies
          </Link>
          <Link to="/pharmacy/register" className="transition hover:text-[#1f5649]">
            Partner with us
          </Link>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            to="/pharmacy/register"
            className="cursor-pointer text-[14px] font-medium text-[#3b6458] transition hover:text-[#1f5649]"
          >
            Create Account
          </Link>
          <Button asChild className="h-10 px-5 text-xs font-medium cursor-pointer">
            <Link to="/">Find a drug</Link>
          </Button>
        </div>

        {/* Mobile: search button + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild className="h-10 px-3.5 text-[11px] font-medium sm:px-4 sm:text-xs">
            <Link to="/">Search</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-white text-(--color-foreground) shadow-[0_10px_24px_rgba(31,86,73,0.08)]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[rgba(31,86,73,0.08)] bg-[rgba(255,255,255,0.96)] px-5 pb-5 pt-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-2 text-sm font-medium text-[#355b50]">
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-3 py-3 transition hover:bg-(--color-surface-soft)"
              >
                How it works
              </Link>
              <Link
                to="/pharmacies"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-3 py-3 transition hover:bg-(--color-surface-soft)"
              >
                Find pharmacies
              </Link>
              <Link
                to="/pharmacy/register"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-3 py-3 transition hover:bg-(--color-surface-soft)"
              >
                Partner with us
              </Link>
            </div>

            <Link
              to="/pharmacy/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 block w-full rounded-full border border-(--color-border) bg-white px-4 py-3 text-center text-sm font-semibold text-(--color-foreground) shadow-[0_10px_24px_rgba(31,86,73,0.06)]"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
