import type { Settings } from "@/lib/defaults";

export default function About({ about }: { about: Settings["about"] }) {
  const paragraphs = about.body.split(/\n{2,}/).filter(Boolean);
  return (
    <section id="about" className="border-b border-[var(--line)] py-20">
      <div className="container-x grid items-center gap-12 md:grid-cols-[360px_1fr]">
        <div className="card relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden">
          {about.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.photoUrl} alt="Moizza Fatima" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#14465a] to-[#0b2a35]">
              <span className="font-display text-7xl font-extrabold text-gold">MF</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-6 w-4 rounded-sm border border-gold/50" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow">03 / About</p>
          <h2 className="mt-4 text-4xl font-extrabold text-cream md:text-5xl">{about.title}</h2>
          <div className="mt-6 space-y-4 text-lg text-[var(--muted)]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
