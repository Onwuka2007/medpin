import { MapPinCheck } from "lucide-react";
import { heroContent } from "../../data/mock";
export default function CommunityBadge() {
  return (
    <div className="group inline-flex items-center gap-2 rounded-full text-black/80 backdrop-blur-sm px-4 py-1.5 border transition-all bg-white border-green-200 shadow-md shadow-blue-500/5 cursor-default">
      <MapPinCheck size={15} />
      <p className="text-[13px] tracking-tight ">{heroContent.title}</p>
    </div>
  );
}
