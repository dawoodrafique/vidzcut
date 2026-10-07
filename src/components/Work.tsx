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
    <section id="work" className="on-dark relative overflow-hidden bg-[#0c3240] py-24 text-white [--fade:#0c3240]">
      <span aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#2a8ba3]/25 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/3 h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[290px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow !text-gold">01 / Work</p>
          <h2 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">My work</h2>
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
                    : "border-white/15 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
                }`}
              >
                {categories[c].label}
                <span className={`text-xs font-bold tabular-nums ${active === c ? "text-[#2a1d00]/70" : "text-white/50"}`}>
                  {String(count(c)).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-7 max-w-[34ch] leading-relaxed text-white/70">{categories[active].description}</p>
        </div>

        <div role="tabpanel" className="min-w-0 space-y-12">
          {items.length === 0 && (
            <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-white/25 bg-white/5 p-8 text-center text-white/70">
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
