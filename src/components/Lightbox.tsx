"use client";

import { useEffect, useRef } from "react";
import { embedUrl } from "@/lib/youtube";
import type { Video } from "@/lib/data";

export default function Lightbox({ video, onClose }: { video: Video; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const vertical = video.orientation === "vertical";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title || "Video player"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-cream hover:bg-white/20"
      >
        ×
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`overflow-hidden rounded-2xl bg-black shadow-2xl ${
          vertical ? "aspect-[9/16] h-[min(86vh,820px)]" : "aspect-video w-[min(92vw,1000px)]"
        }`}
      >
        <iframe
          title={video.title || "Video"}
          src={embedUrl(video.youtubeId, { autoplay: true })}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
