import type { Settings } from "@/lib/defaults";
import TimelineGraphic from "./TimelineGraphic";

export default function Hero({ hero }: { hero: Settings["hero"] }) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-[var(--line)] py-20 text-center md:py-28">
      <div className="container-x">
        <h1 className="mx-auto max-w-[860px] text-balance text-[clamp(2.4rem,7vw,5rem)] font-extrabold leading-[1.02] text-cream">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-pretty text-lg text-[var(--muted)]">{hero.subline}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#work" className="btn btn-gold">
            See my work
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get a quote
          </a>
        </div>
        <TimelineGraphic />
      </div>
    </section>
  );
}
