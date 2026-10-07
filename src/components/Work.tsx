"use client";

import { useCallback, useState } from "react";
import { CATEGORIES, type Category, type Settings } from "@/lib/defaults";
import type { Video } from "@/lib/data";
import Lightbox from "./Lightbox";
import Slider from "./Slider";
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
  const count = (c: Category) => videos.filter((v) => v.category === c).length;

  return (
    <section id="work" className="bg-[var(--bg-soft)] py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[290px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">01 / Work</p>
          <h2 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">My work</h2>
          <div role="tablist" aria-label="Work categories" className="mt-8 flex flex-wrap gap-2.5 lg:flex-col lg:gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                onClick={() => setActive(c)}
                className={`flex items-center justify-between gap-6 rounded-full border px-6 py-3.5 text-left font-semibold transition ${
                  active === c
                    ? "border-gold bg-gold text-[#2a1d00] shadow-[0_8px_20px_-10px_rgba(224,160,43,0.9)]"
                    : "border-[var(--line)] bg-white text-ink hover:border-ink/40"
                }`}
              >
                {categories[c].label}
                <span className={`text-xs font-bold tabular-nums ${active === c ? "text-[#2a1d00]/70" : "text-ink-2"}`}>
                  {String(count(c)).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-7 max-w-[34ch] leading-relaxed text-ink-2">{categories[active].description}</p>
        </div>

        <div role="tabpanel" className="min-w-0 space-y-12">
          {items.length === 0 && (
            <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-ink/20 bg-white/60 p-8 text-center text-ink-2">
              New {categories[active].label.toLowerCase()} projects are coming soon.
            </div>
          )}
          {vertical.length > 0 && (
            <Slider key={`${active}-v`} label={`${categories[active].label} reels`}>
              {vertical.map((v) => (
                <div key={v.id} className="min-w-0 shrink-0 basis-[calc((100%-1.25rem)/2)] snap-start sm:basis-[calc((100%-2.5rem)/3)]">
                  <VideoCard video={v} onOpen={setOpen} />
                </div>
              ))}
            </Slider>
          )}
          {landscape.length > 0 && (
            <Slider key={`${active}-l`} label={`${categories[active].label} videos`}>
              {landscape.map((v) => (
                <div key={v.id} className="min-w-0 shrink-0 basis-full snap-start sm:basis-[calc((100%-1.25rem)/2)]">
                  <VideoCard video={v} onOpen={setOpen} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
      {open && <Lightbox video={open} onClose={close} />}
    </section>
  );
}
