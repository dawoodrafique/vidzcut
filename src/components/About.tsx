import type { Settings } from "@/lib/defaults";

const steps = [
  { title: "Send your footage", body: "Share raw clips and a few notes on the style you like." },
  { title: "First cut", body: "A tight edit with pacing, sound and captions in place." },
  { title: "Feedback", body: "Tell me what to change and I refine it until it's right." },
  { title: "Delivery", body: "Final files exported for YouTube, Reels, Shorts or TikTok." },
];

export default function About({ about }: { about: Settings["about"] }) {
  const [lead, ...rest] = about.body.split(/\n{2,}/).filter(Boolean);
  return (
    <section id="about" className="bg-[var(--bg-soft)] py-24">
      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <p className="eyebrow">03 / About</p>
          <h2 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">{about.title}</h2>
          {lead && <p className="mt-8 max-w-[34ch] text-balance font-display text-2xl font-semibold leading-snug text-ink md:text-[1.75rem]">{lead}</p>}
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <a href="#contact" className="btn btn-ink mt-9">
            Start a project
          </a>
        </div>

        <div className="card p-8 md:p-10">
          <h3 className="text-xl font-bold text-ink">How we&apos;ll work together</h3>
          <ol className="mt-8">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                {i < steps.length - 1 && <span aria-hidden="true" className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-[var(--line)]" />}
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-gold">{i + 1}</span>
                <div className="pt-1.5">
                  <p className="font-display text-lg font-bold text-ink">{s.title}</p>
                  <p className="mt-1 text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
