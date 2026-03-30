import { Pill, Cross, Stethoscope } from "lucide-react";

const iconMap = {
  pill: Pill,
  cross: Cross,
  stethoscope: Stethoscope,
};

function HeroMapPin({ icon = "pill", className = "" }) {
  const Icon = iconMap[icon];

  return (
    <div className={`absolute hidden lg:block ${className}`}>
      <div className="relative h-[58px] w-[42px]">
        <div className="absolute left-1/2 top-0 h-[42px] w-[42px] -translate-x-1/2 -rotate-45 rounded-[50%_50%_50%_0] border-[2.5px] border-[#173f36] bg-[#d7ff2f] shadow-[0_10px_24px_rgba(23,63,54,0.14)]" />
        <div className="absolute left-1/2 top-[7px] flex h-[28px] w-[28px] -translate-x-1/2 items-center justify-center text-[#173f36]">
          <Icon className="h-[18px] w-[18px] rotate-45" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

export default HeroMapPin;