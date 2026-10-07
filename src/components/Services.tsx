import type { ServiceItem } from "@/lib/defaults";

function Icon({ name }: { name: ServiceItem["icon"] }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
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
    <section id="services" className="py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">02 / Services</p>
            <h2 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">What I do</h2>
          </div>
          <p className="max-w-[40ch] text-ink-2">Send raw footage, get back a video that&apos;s ready to publish.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((s, i) => {
            const feature = i === 0;
            return (
              <article
                key={i}
                className={`group relative overflow-hidden rounded-[24px] p-8 transition duration-300 hover:-translate-y-1 ${spans[i % spans.length]} ${
                  feature
                    ? "bg-gradient-to-br from-[#12495a] to-[#082029] text-white shadow-[0_30px_60px_-30px_rgba(11,42,53,0.8)]"
                    : "border border-[var(--line)] bg-white shadow-[var(--shadow)]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature ? "bg-gold text-[#2a1d00]" : "bg-gold/20 text-gold-ink"}`}>
                    <Icon name={s.icon} />
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${feature ? "text-white/40" : "text-ink/25"}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className={`mt-10 text-2xl font-bold ${feature ? "text-white" : "text-ink"}`}>{s.title}</h3>
                <p className={`mt-2 max-w-[44ch] leading-relaxed ${feature ? "text-white/75" : "text-ink-2"}`}>{s.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
