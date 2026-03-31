import mobileMapVideo from "../../assets/map-mobile.mp4";

export default function HeroVideoExtension() {
  return (
    <section className="px-6 pb-20 pt-2 sm:px-8 lg:px-10 lg:pb-28">
      <div className="mx-auto">
        <div className="relative overflow-hidden rounded-[1.75rem]">
          <video
            className="block w-full object-cover"
            src={mobileMapVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="pointer-events-none absolute md:block hidden inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.82)_58%,rgba(255,255,255,1)_100%)]" />
        </div>
      </div>
    </section>
  );
}