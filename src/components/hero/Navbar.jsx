import { useState } from "react";
import {
  ChevronDown,
  FileSearch,
  Menu,
  PackageSearch,
  Sparkles,
  X,
} from "lucide-react";
import Logo from "../ui/Logo.jsx";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";
import { Button } from "../ui/button.jsx";

function Navbar({ onOpenAssistant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function openAssistantFromMenu(actionId) {
    setMobileMenuOpen(false);
    onOpenAssistant?.(actionId);
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group inline-flex items-center gap-1.5 rounded-full py-2 text-sm font-medium transition hover:text-[#1f5649] data-[state=open]:text-[#1f5649]"
              >
                Assistant
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Assistant tools</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onOpenAssistant?.("scan-prescription")}>
                <FileSearch className="h-4.5 w-4.5 text-(--color-primary)" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">Scan doctor&apos;s scribble</span>
                  <span className="text-xs text-[#6c877e]">
                    Upload a prescription photo and extract the drug names.
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onOpenAssistant?.("scan-drug-pack")}>
                <PackageSearch className="h-4.5 w-4.5 text-(--color-primary)" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">Scan drug pack</span>
                  <span className="text-xs text-[#6c877e]">
                    Detect name and strength from a pack or label image.
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onOpenAssistant?.()}>
                <Sparkles className="h-4.5 w-4.5 text-(--color-primary)" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">Open AI assistant</span>
                  <span className="text-xs text-[#6c877e]">
                    Browse quick actions and dummy assistant responses.
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

            <div className="mt-4 rounded-[1.4rem] border border-(--color-border) bg-white p-2 shadow-[0_12px_30px_rgba(31,86,73,0.06)]">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
                Assistant tools
              </p>

              <button
                type="button"
                onClick={() => openAssistantFromMenu("scan-prescription")}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-(--color-surface-soft)"
              >
                <FileSearch className="mt-0.5 h-4.5 w-4.5 text-(--color-primary)" />
                <span>
                  <span className="block text-sm font-medium text-(--color-foreground)">
                    Scan doctor&apos;s scribble
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6c877e]">
                    Upload a prescription photo and extract the drug names.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => openAssistantFromMenu("scan-drug-pack")}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-(--color-surface-soft)"
              >
                <PackageSearch className="mt-0.5 h-4.5 w-4.5 text-(--color-primary)" />
                <span>
                  <span className="block text-sm font-medium text-(--color-foreground)">
                    Scan drug pack
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6c877e]">
                    Detect name and strength from a pack or label image.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => openAssistantFromMenu()}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-(--color-surface-soft)"
              >
                <Sparkles className="mt-0.5 h-4.5 w-4.5 text-(--color-primary)" />
                <span>
                  <span className="block text-sm font-medium text-(--color-foreground)">
                    Open AI assistant
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6c877e]">
                    Browse quick actions and dummy assistant responses.
                  </span>
                </span>
              </button>
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
