import { ChevronDown, FileSearch, PackageSearch, Sparkles } from "lucide-react";
import Logo from "../ui/Logo.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

function Navbar({ onOpenAssistant }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(31,86,73,0.08)] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:py-2 py-1.5 sm:px-8 lg:px-10">
        <div tabIndex="0">
          <Logo />
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#3b6458] lg:flex">
          <a href="#how-it-works" className="transition hover:text-[#1f5649]">
            How it works
          </a>
          <a
            href="#find-pharmacies"
            className="transition hover:text-[#1f5649]"
          >
            Find pharmacies
          </a>
          <a href="#support" className="transition hover:text-[#1f5649]">
            Support
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition hover:text-[#1f5649] data-[state=open]:text-[#1f5649]"
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
              <DropdownMenuItem onSelect={() => onOpenAssistant("scan-prescription")}>
                <FileSearch className="h-4.5 w-4.5 text-(--color-primary)" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">Scan doctor&apos;s scribble</span>
                  <span className="text-xs text-[#6c877e]">
                    Upload a prescription photo and extract the drug names.
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onOpenAssistant("scan-drug-pack")}>
                <PackageSearch className="h-4.5 w-4.5 text-(--color-primary)" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">Scan drug pack</span>
                  <span className="text-xs text-[#6c877e]">
                    Detect name and strength from a pack or label image.
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onOpenAssistant()}>
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

        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={onOpenAssistant}
            className="hidden items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2.5 text-sm font-semibold text-(--color-foreground) shadow-[0_10px_28px_rgba(31,86,73,0.08)] transition hover:bg-(--color-surface-soft) sm:inline-flex"
          >
            <Bot
              className="h-4.5 w-4.5 text-(--color-primary)"
              strokeWidth={2.2}
            />
            Quick scan
          </button> */}

          <button className="text-[14px] font-medium text-[#3b6458] transition hover:text-[#1f5649] cursor-pointer">
            Create Account
          </button>
          <button
            type="button"
            className="rounded-full bg-[#1f5649] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#173f36] cursor-pointer"
          >
            Find a drug
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
