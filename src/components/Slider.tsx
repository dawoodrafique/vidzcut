"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Horizontal scroll-snap row. Right arrow shows when more items are off-screen, left arrow once scrolled. */
export default function Slider({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [can, setCan] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCan({ left: el.scrollLeft > 8, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, children]);

  function scroll(dir: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  const arrow =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-[0_10px_30px_-8px_rgba(11,42,53,0.45)] ring-1 ring-black/5 transition hover:scale-105 hover:bg-gold";

  return (
    <div className="relative" role="region" aria-label={label}>
      <div ref={track} className="no-scrollbar -my-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-12 pt-6">
        {children}
      </div>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[var(--bg-soft)] to-transparent transition-opacity ${can.left ? "opacity-100" : "opacity-0"}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--bg-soft)] to-transparent transition-opacity ${can.right ? "opacity-100" : "opacity-0"}`}
      />
      {can.left && (
        <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className={`${arrow} -left-3 sm:-left-5`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
      )}
      {can.right && (
        <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className={`${arrow} -right-3 sm:-right-5`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
