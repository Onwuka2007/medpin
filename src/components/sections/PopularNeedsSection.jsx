import {
  Clock3,
  SearchX,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "../ui/button.jsx";

const featureItems = [
  {
    id: "feature-brand",
    icon: SearchX,
    heading: "Can't find your specific brand?",
    copy:
      "MedPin shows stocked options and suggests a verified generic alternative.",
  },
  {
    id: "feature-calls",
    icon: Clock3,
    heading: "Tired of calling 20 pharmacies?",
    copy:
      "Check live stock across Lagos, Abuja, and Port Harcourt without calling around.",
  },
  {
    id: "feature-doctor",
    icon: Stethoscope,
    heading: 'Told to "check around" by your doctor?',
    copy:
      "We connect your prescription to the nearest pharmacies that actually have it in stock.",
  },
  {
    id: "feature-pricing",
    icon: ShieldCheck,
    heading: "Worried about fluctuating costs?",
    copy:
      "Compare pharmacy prices before you leave home and avoid price surprises at the counter.",
  },
];

function PopularNeedsSection() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-20 sm:px-8 sm:py-24 lg:px-30 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7a938a]">
            Stop Searching, Start Finding
          </p>
          <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.05em] text-[#173f36] sm:text-[2.7rem]">
            We've simplified the medication search for thousands of Nigerians.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.id}
                className="group rounded-[1.25rem] border border-[#dbe7e0] bg-white p-6 shadow-[0_14px_34px_rgba(31,86,73,0.06)] transition hover:border-[#c9ddd4] hover:shadow-[0_18px_38px_rgba(31,86,73,0.08)]"
              >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef6f1] text-[#1f5649] transition group-hover:bg-[#1f5649] group-hover:text-white">
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2.1} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold tracking-[-0.03em] text-[#173f36]">
                      {item.heading}
                    </h3>
                    <p className="mt-3 text-sm text-[#58766c]">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="shadow-[0_16px_34px_rgba(31,86,73,0.22)]">
            <a href="#find-drug">Find My Medication Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PopularNeedsSection;
