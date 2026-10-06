import { describe, it, expect } from "vitest";
import { parseYouTubeId, thumbnailUrl, embedUrl } from "@/lib/youtube";

const ID = "dQw4w9WgXcQ";

describe("parseYouTubeId", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}?t=5`,
    `https://youtube.com/shorts/${ID}`,
    `https://m.youtube.com/watch?v=${ID}&feature=share`,
    `https://www.youtube.com/embed/${ID}`,
    `  ${ID}  `,
  ])("extracts id from %s", (input) => {
    expect(parseYouTubeId(input)).toBe(ID);
  });

  it.each(["", "hello", "https://vimeo.com/123", `https://evil.com/watch?v=${ID}`, "https://www.youtube.com/watch?v=short"])(
    "rejects %s",
    (input) => {
      expect(parseYouTubeId(input)).toBeNull();
    },
  );
});

describe("urls", () => {
  it("builds thumbnail url", () => {
    expect(thumbnailUrl("abc12345678")).toBe("https://img.youtube.com/vi/abc12345678/hqdefault.jpg");
  });
  it("builds a muted looping autoplay embed", () => {
    const u = embedUrl("abc12345678", { autoplay: true, muted: true, loop: true });
    expect(u).toContain("youtube-nocookie.com/embed/abc12345678");
    expect(u).toContain("autoplay=1");
    expect(u).toContain("mute=1");
    expect(u).toContain("loop=1");
    expect(u).toContain("playlist=abc12345678");
  });
});
