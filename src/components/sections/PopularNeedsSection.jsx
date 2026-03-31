import { ArrowUpRight } from "lucide-react";
import { mockPopularNeeds } from "../../data/mock/index.js";

function PopularNeedsSection() {
  return (
    <section className="bg-white px-6 pb-24 pt-4 sm:px-8 lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7a938a]">
            Explore common needs
          </p>
          <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-(--color-foreground) sm:text-[2.4rem]">
            Start from what you need, not just what you can spell.
          </h2>
        </div>

        <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
          {mockPopularNeeds.map((need) => (
            <article
              key={need.id}
              className="group relative h-128 w-76 shrink-0 snap-start overflow-hidden rounded-4xl shadow-[0_18px_44px_rgba(31,86,73,0.12)] sm:w-88 lg:w-[24rem]"
            >
              <img
                src={need.image}
                alt={need.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/35 to-transparent" />

              <div className="relative flex h-full flex-col justify-between p-8 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.25rem] font-bold tracking-tight leading-tight">
                      {need.title}
                    </h3>
                  </div>

                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/10 text-white backdrop-blur-md transition group-hover:bg-white/16">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[1.7rem] font-extrabold tracking-tighter">
                      {need.resultCount}+
                    </span>
                    <span className="text-sm font-medium opacity-90">
                      nearby matches
                    </span>
                  </div>

                  <p className="text-[13px] text-white/80">
                    {need.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularNeedsSection;
