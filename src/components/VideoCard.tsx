"use client";

import { useEffect, useRef, useState } from "react";
import { useYouTubePlayer } from "@/lib/yt";
import { thumbnailUrl } from "@/lib/youtube";
import type { Video } from "@/lib/data";

function Preview({ videoId }: { videoId: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const { state } = useYouTubePlayer(wrapper, videoId, { loop: true });
  return (
    <>
      <div
        ref={wrapper}
        className={`yt-crop transition-opacity duration-500 ${state.playing ? "opacity-100" : "opacity-0"}`}
      />
      {state.blocked && (
        <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur" title="Click to watch with sound">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" />
          </svg>
        </span>
      )}
    </>
  );
}

export default function VideoCard({ video, onOpen }: { video: Video; onOpen: (v: Video) => void }) {
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vertical = video.orientation === "vertical";

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function start(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    timer.current = setTimeout(() => setPreview(true), 200);
  }
  function stop() {
    if (timer.current) clearTimeout(timer.current);
    setPreview(false);
  }

  const label = video.title || "Video";

  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      onPointerEnter={start}
      onPointerLeave={stop}
      aria-label={`Play ${label}`}
      className={`group relative block w-full overflow-hidden rounded-[22px] bg-[var(--teal-deep)] text-left shadow-[0_18px_40px_-20px_rgba(11,42,53,0.55)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-22px_rgba(11,42,53,0.65)] ${
        vertical ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl(video.youtubeId)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
      {preview && <Preview videoId={video.youtubeId} />}

      <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#04141a]/90 via-[#04141a]/45 to-transparent" />

      <span
        className={`absolute left-1/2 top-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/60 backdrop-blur-md transition duration-300 ${
          preview ? "scale-75 opacity-0" : "group-hover:scale-110 group-hover:bg-white/30"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
          <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
        </svg>
      </span>

      {(video.title || video.subtitle) && (
        <span className="absolute inset-x-0 bottom-0 block p-4 sm:p-5">
          {video.title && <span className="font-display block text-[15px] font-bold leading-snug text-white sm:text-base">{video.title}</span>}
          {video.subtitle && <span className="mt-1 block text-xs text-white/75 sm:text-[13px]">{video.subtitle}</span>}
        </span>
      )}
    </button>
  );
}
