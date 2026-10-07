"use client";

import { useEffect, useRef } from "react";
import { useYouTubePlayer } from "@/lib/yt";
import type { Video } from "@/lib/data";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function Lightbox({ video, onClose }: { video: Video; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const { state, toggle, toggleMute, seek } = useYouTubePlayer(wrapper, video.youtubeId, { trackProgress: true });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, toggle]);

  const vertical = video.orientation === "vertical";
  const pct = state.duration ? (state.time / state.duration) * 100 : 0;
  const iconBtn = "flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title || "Video player"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04141a]/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`group relative overflow-hidden rounded-[26px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${
          vertical ? "aspect-[9/16] h-[min(88vh,840px)]" : "aspect-video w-[min(92vw,1040px)]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div ref={wrapper} className={`yt-crop transition-opacity duration-500 ${state.playing || state.time > 0 ? "opacity-100" : "opacity-0"}`} />

        {/* click anywhere on the video to pause / play */}
        <button type="button" onClick={toggle} aria-label={state.playing ? "Pause" : "Play"} className="absolute inset-0 z-[1] cursor-pointer" />
        {!state.playing && state.time > 0 && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/60 backdrop-blur-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
              <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
            </svg>
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10">
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(state.duration)}
            aria-valuenow={Math.round(state.time)}
            className="relative h-1.5 cursor-pointer rounded-full bg-white/25"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - r.left) / r.width);
            }}
            onKeyDown={(e) => {
              if (!state.duration) return;
              if (e.key === "ArrowRight") seek((state.time + 5) / state.duration);
              if (e.key === "ArrowLeft") seek((state.time - 5) / state.duration);
            }}
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <button type="button" onClick={toggle} aria-label={state.playing ? "Pause" : "Play"} className={iconBtn}>
              {state.playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
                </svg>
              )}
            </button>
            <button type="button" onClick={toggleMute} aria-label={state.muted ? "Unmute" : "Mute"} className={iconBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                {state.muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
              </svg>
            </button>
            <span className="ml-1 text-xs tabular-nums text-white/80">
              {fmt(state.time)} / {fmt(state.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
