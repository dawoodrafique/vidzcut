"use client";

import { useCallback, useState } from "react";
import { CATEGORIES, type Category, type Settings } from "@/lib/defaults";
import type { Video } from "@/lib/data";
import Lightbox from "./Lightbox";
import VideoCard from "./VideoCard";

export default function Work({
  categories,
  videos,
}: {
  categories: Settings["categories"];
  videos: Video[];
}) {
  const [active, setActive] = useState<Category>("motion");
  const [open, setOpen] = useState<Video | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const items = videos.filter((v) => v.category === active);
  const vertical = items.filter((v) => v.orientation === "vertical");
  const landscape = items.filter((v) => v.orientation === "landscape");

  return (
    <section id="work" className="border-b border-[var(--line)] py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">01 / Work</p>
          <h2 className="mt-4 text-4xl font-extrabold text-cream md:text-5xl">My work</h2>
          <div role="tablist" aria-label="Work categories" className="mt-6 flex flex-wrap gap-3 lg:flex-col">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-6 py-3 text-left font-semibold transition ${
                  active === c
                    ? "border-gold bg-gold text-[#2a1d00]"
                    : "border-[var(--line)] bg-black/25 text-cream hover:border-gold/60"
                }`}
              >
                {categories[c].label}
              </button>
            ))}
          </div>
          <p className="mt-6 max-w-[34ch] text-[var(--muted)]">{categories[active].description}</p>
        </div>

        <div role="tabpanel" className="min-w-0 space-y-10">
          {items.length === 0 && (
            <div className="card flex min-h-[260px] items-center justify-center p-8 text-center text-[var(--muted)]">
              New {categories[active].label.toLowerCase()} projects are coming soon.
            </div>
          )}
          {vertical.length > 0 && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {vertical.map((v) => (
                <VideoCard key={v.id} video={v} onOpen={setOpen} />
              ))}
            </div>
          )}
          {landscape.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {landscape.map((v) => (
                <VideoCard key={v.id} video={v} onOpen={setOpen} />
              ))}
            </div>
          )}
        </div>
      </div>
      {open && <Lightbox video={open} onClose={close} />}
    </section>
  );
}
