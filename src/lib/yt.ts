"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  unloadModule?(name: string): void;
  destroy(): void;
};
type YTEvent = { target: YTPlayer; data: number };
type YTNamespace = { Player: new (el: HTMLElement, opts: unknown) => YTPlayer };

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") return new Promise(() => undefined);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT as YTNamespace);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

export type PlayerState = {
  playing: boolean;
  muted: boolean;
  /** Browser refused to autoplay with sound, so we fell back to muted playback. */
  blocked: boolean;
  time: number;
  duration: number;
};

const initial: PlayerState = { playing: false, muted: false, blocked: false, time: 0, duration: 0 };

/**
 * Mounts a YouTube player into `wrapperRef` and starts it with sound and captions off.
 * If the browser blocks sound autoplay, falls back to muted playback and reports `blocked`.
 */
export function useYouTubePlayer(
  wrapperRef: RefObject<HTMLDivElement | null>,
  videoId: string,
  opts: { loop?: boolean; trackProgress?: boolean } = {},
) {
  const { loop = false, trackProgress = false } = opts;
  const playerRef = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<PlayerState>(initial);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const target = document.createElement("div");
    wrapper.appendChild(target);

    const forceMuted = () => {
      const p = playerRef.current;
      if (!p) return;
      p.mute();
      p.playVideo();
      setState((s) => ({ ...s, blocked: true, muted: true }));
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(target, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          loop: loop ? 1 : 0,
          ...(loop ? { playlist: videoId } : {}),
        },
        events: {
          onReady: (e: YTEvent) => {
            try {
              e.target.unloadModule?.("captions");
            } catch {
              /* captions module may not be loaded */
            }
            e.target.playVideo();
            fallback = setTimeout(() => {
              const st = playerRef.current?.getPlayerState();
              if (st !== 1 && st !== 3) forceMuted();
            }, 1500);
          },
          onAutoplayBlocked: forceMuted,
          onStateChange: (e: YTEvent) => {
            const p = e.target;
            setState((s) => ({ ...s, playing: e.data === 1, muted: p.isMuted() }));
          },
        },
      });
    });

    const timer = trackProgress
      ? setInterval(() => {
          const p = playerRef.current;
          if (!p?.getDuration) return;
          try {
            setState((s) => ({ ...s, time: p.getCurrentTime(), duration: p.getDuration() }));
          } catch {
            /* player not ready */
          }
        }, 250)
      : undefined;

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      clearInterval(timer);
      try {
        playerRef.current?.destroy();
      } catch {
        /* already gone */
      }
      playerRef.current = null;
      wrapper.innerHTML = "";
      setState(initial);
    };
  }, [wrapperRef, videoId, loop, trackProgress]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.getPlayerState() === 1) p.pauseVideo();
    else p.playVideo();
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) p.unMute();
    else p.mute();
    setState((s) => ({ ...s, muted: p.isMuted() }));
  }, []);

  const seek = useCallback((fraction: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(Math.max(0, Math.min(1, fraction)) * p.getDuration(), true);
  }, []);

  return { state, toggle, toggleMute, seek };
}
