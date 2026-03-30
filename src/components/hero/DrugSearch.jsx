import { Button } from "../ui/button.jsx";

function DrugSearch() {
  return (
    <div className="mt-9 w-full max-w-3xl rounded-full border border-(--color-border) bg-[linear-gradient(180deg,rgba(244,250,246,0.98),rgba(239,247,242,0.96))] p-2 shadow-[0_18px_50px_rgba(135,170,151,0.22)]">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-full border border-(--color-input) bg-(--color-surface) p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
        <label className="group flex min-w-0 items-center gap-3 rounded-full px-4 py-2.5 text-left sm:px-5 sm:py-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-secondary)_0%,#deeee5_100%)] text-(--color-primary) shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:flex">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current stroke-[1.9]"
            >
              <path
                d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search Paracetamol, Ventolin, Amatem..."
            className="w-full bg-transparent text-[0.98rem] font-medium text-(--color-foreground) outline-none placeholder:text-(--color-muted) sm:text-[1rem]"
          />
        </label>

        <Button
          size="icon"
          className="sm:h-13 sm:w-auto sm:px-7 sm:py-3 sm:text-[0.98rem] sm:font-semibold"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current stroke-[2.2] sm:hidden"
          >
            <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Find pharmacies</span>
        </Button>
      </div>
    </div>
  );
}

export default DrugSearch;
