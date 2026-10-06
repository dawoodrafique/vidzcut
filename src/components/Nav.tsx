const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#0b2a35]/85 backdrop-blur">
      <div className="container-x flex h-[68px] items-center justify-between">
        <a href="#top" className="font-display text-xl font-bold text-cream">
          Moizza Fatima
        </a>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-medium text-cream transition hover:text-gold">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-gold !py-2.5">
            Get a quote
          </a>
        </nav>
        <details className="relative md:hidden">
          <summary className="btn btn-ghost !px-4 !py-2 list-none [&::-webkit-details-marker]:hidden">Menu</summary>
          <div className="card absolute right-0 mt-2 flex w-52 flex-col gap-1 bg-[#0b2a35] p-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-cream hover:bg-white/5">
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-gold mt-1 !py-2.5">
              Get a quote
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
