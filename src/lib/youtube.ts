const ID_RE = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"]);

/** Extract an 11-char YouTube video id from a URL (watch, youtu.be, shorts, embed) or a bare id. */
export function parseYouTubeId(input: string): string | null {
  const value = (input ?? "").trim();
  if (!value) return null;
  if (ID_RE.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (!HOSTS.has(url.hostname.toLowerCase())) return null;

  let candidate: string | null = null;
  if (url.hostname.toLowerCase() === "youtu.be") {
    candidate = url.pathname.split("/")[1] ?? null;
  } else if (url.pathname === "/watch") {
    candidate = url.searchParams.get("v");
  } else {
    const [, kind, id] = url.pathname.split("/");
    if (kind === "shorts" || kind === "embed" || kind === "live" || kind === "v") candidate = id ?? null;
  }
  return candidate && ID_RE.test(candidate) ? candidate : null;
}

export function thumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function embedUrl(
  id: string,
  opts: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {},
): string {
  const p = new URLSearchParams({ playsinline: "1", rel: "0", modestbranding: "1" });
  if (opts.autoplay) p.set("autoplay", "1");
  if (opts.muted) {
    p.set("mute", "1");
    p.set("controls", "0");
  }
  if (opts.loop) {
    p.set("loop", "1");
    p.set("playlist", id);
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}
