"use client";

import { useEffect, useRef, useState } from "react";
import { embedUrl, thumbnailUrl } from "@/lib/youtube";
import type { Video } from "@/lib/data";

export default function VideoCard({ video, onOpen }: { video: Video; onOpen: (v: Video) => void }) {
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vertical = video.orientation === "vertical";

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function start(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    timer.current = setTimeout(() => setPreview(true), 250);
  }
  function stop() {
    if (timer.current) clearTimeout(timer.current);
    setPreview(false);
  }

  const label = video.title || "Video";

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => onOpen(video)}
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={() => undefined}
        aria-label={`Play ${label}`}
        className={`group relative block w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0d3442] ${
          vertical ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl(video.youtubeId)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover transition duration-500 group-hover:scale-105"
        />
        {preview && (
          <iframe
            title={`${label} preview`}
            src={embedUrl(video.youtubeId, { autoplay: true, muted: true, loop: true })}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 ${
              vertical ? "h-full w-[320%]" : "h-full w-full"
            }`}
          />
        )}
        <span
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-[#2a1d00] shadow-lg transition ${
            preview ? "scale-75 opacity-0" : "group-hover:scale-110"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      {(video.title || video.subtitle) && (
        <div className="mt-3">
          {video.title && <p className="font-display font-bold text-cream">{video.title}</p>}
          {video.subtitle && <p className="text-sm text-[var(--muted)]">{video.subtitle}</p>}
        </div>
      )}
    </div>
  );
}
