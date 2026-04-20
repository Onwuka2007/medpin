import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AlternativeSearchRow({ alternative, userLocation }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/search?q=${encodeURIComponent(alternative.name)}`, {
          state: { userLocation },
        })
      }
      className="group cursor-pointer flex w-full items-start justify-between gap-3 rounded-[1.25rem] border border-[rgba(31,86,73,0.1)] bg-white px-4 py-3 text-left transition hover:border-[rgba(31,86,73,0.2)] hover:bg-[#fbfdfb]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-(--color-foreground)">
          {alternative.name}
        </span>
        <span className="mt-1 block text-xs text-[#648277]">
          {alternative.genericName} • {alternative.strength}
        </span>
        <span className="mt-1 block text-xs text-(--color-primary)">
          Search nearby stock for this alternative
        </span>
      </span>
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(31,86,73,0.08)] bg-[#f7fbf8] text-(--color-primary) transition group-hover:bg-(--color-primary) group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </button>
  );
}

export default AlternativeSearchRow;
