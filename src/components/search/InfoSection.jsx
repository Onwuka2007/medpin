function InfoSection({ title, children, tone = "white" }) {
  const toneClass = tone === "warm" ? "bg-[#fffdf8]" : "bg-white";

  return (
    <section className={`px-5 py-8 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#799188]">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default InfoSection;
