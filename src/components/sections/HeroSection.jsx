import { heroContent, heroMapPins } from "../../data/mock/index.js";
import mapHero from "../../assets/mapHero.png";
import HeroNavbar from "../hero/Navbar.jsx";
import HeroSearch from "../hero/DrugSearch.jsx";
import CommunityBadge from "../ui/MarkIcon.jsx";
import HeroMapPin from "../ui/Pin.jsx";

function HeroSection({ onOpenAssistant }) {
  return (
    <section className="relative z-20 overflow-visible pb-16 pt-3 lg:pb-20">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
          style={{ backgroundImage: `url(${mapHero})` }}
        />
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.92)]" />
      </div>

      {heroMapPins.map((pin) => (
        <HeroMapPin key={pin.id} icon={pin.icon} className={pin.className} />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 pt-22 sm:px-8 sm:pt-24 lg:px-10 lg:pt-26">
        <HeroNavbar onOpenAssistant={onOpenAssistant} />

        <div className="mx-auto flex max-w-232 flex-col items-center pb-8 pt-12 text-center sm:pt-16 lg:pb-16 lg:pt-18">
          <CommunityBadge />

          <h1 className="mt-5 max-w-[850px] w-full text-[2.3rem] font-semibold md:leading-[1.06] tracking-[-0.05em] text-[#1f5649] sm:text-[3.75rem] lg:text-[4.75rem]">
            {heroContent.title}.
          </h1>

          <p className="mt-6 max-w-160 text-base leading-7 text-[#507166] sm:text-lg">
            {heroContent.description}
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#56756a]">
            {heroContent.ctas.map((item, index) => (
              <span key={item} className="contents">
                {index > 0 && (
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-[#97b3a8] sm:inline-block" />
                )}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
