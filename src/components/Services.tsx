import type { ServiceItem } from "@/lib/defaults";

function Icon({ name }: { name: ServiceItem["icon"] }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "scissors":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
        </svg>
      );
    case "captions":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M7 10h10M7 14h6" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M3 14h18M9 4v16M15 4v16" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
        </svg>
      );
  }
}

// Bento spans on a 3-col grid: wide, narrow / narrow, wide
const spans = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export default function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section id="services" className="border-b border-[var(--line)] py-20">
      <div className="container-x">
        <p className="eyebrow">02 / Services</p>
        <h2 className="mt-4 text-4xl font-extrabold text-cream md:text-5xl">What I do</h2>
        <p className="mt-3 text-[var(--muted)]">Send raw footage, get back a video that&apos;s ready to publish.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((s, i) => (
            <article key={i} className={`card p-7 ${spans[i % spans.length]} ${i === 0 ? "bg-gold/[0.07]" : ""}`}>
              <div className="text-gold">
                <Icon name={s.icon} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-cream">{s.title}</h3>
              <p className="mt-2 max-w-[48ch] text-[var(--muted)]">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
