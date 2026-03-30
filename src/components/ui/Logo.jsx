import logo from "../../../public/logo.png";

function Logo({ className = "", textClassName = "" }) {
  return (
    <a tabIndex='-1' href="/" className={`flex items-center gap-1 ${className}`.trim()}>
      <img
        src={logo}
        alt="MedPin - Find nearby pharmacies with the drug you need"
        className="h-8 w-auto"
      />
      <span
        className={`font-['Cherry_Cream_Soda',cursive] text-sm leading-none tracking-[-0.01em] text-(--color-primary) ${textClassName}`.trim()}
      >
        MedPin
      </span>
    </a>
  );
}

export default Logo;
