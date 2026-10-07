const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/80 backdrop-blur-xl">
      <div className="container-x flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink text-[13px] font-extrabold text-gold">
            MF
          </span>
          Moizza Fatima
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-medium text-ink-2 transition hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-ink !px-5 !py-2.5">
            Get a quote
          </a>
        </nav>
        <details className="relative md:hidden">
          <summary className="btn btn-ghost list-none !px-4 !py-2 [&::-webkit-details-marker]:hidden">Menu</summary>
          <div className="card absolute right-0 mt-2 flex w-56 flex-col gap-1 p-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-xl px-3 py-2.5 font-medium text-ink hover:bg-[var(--bg-soft)]">
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-ink mt-1 !py-2.5">
              Get a quote
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
