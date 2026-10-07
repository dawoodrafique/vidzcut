import type { Settings } from "@/lib/defaults";
import TimelineGraphic from "./TimelineGraphic";

export default function Hero({ hero }: { hero: Settings["hero"] }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[radial-gradient(900px_500px_at_85%_-10%,rgba(249,191,75,0.22),transparent_60%),radial-gradient(700px_500px_at_-5%_40%,rgba(15,58,72,0.08),transparent_60%)] py-16 md:py-24"
    >
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-sm font-medium text-ink-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gold" />
            Video editor for creators &amp; brands
          </span>
          <h1 className="mt-6 text-balance text-[clamp(2.5rem,6vw,4.6rem)] font-extrabold leading-[1.02] text-ink">{hero.headline}</h1>
          <p className="mt-6 max-w-[520px] text-pretty text-lg leading-relaxed text-ink-2">{hero.subline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-gold">
              See my work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get a quote
            </a>
          </div>
        </div>
        <TimelineGraphic />
      </div>
    </section>
  );
}
