import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  delete process.env.DATABASE_URL;
});

describe("data layer without a database", () => {
  it("returns default settings", async () => {
    const { getSettings } = await import("@/lib/data");
    const { defaultSettings } = await import("@/lib/defaults");
    expect(await getSettings()).toEqual(defaultSettings);
  });
  it("returns no videos", async () => {
    const { getVideos } = await import("@/lib/data");
    expect(await getVideos()).toEqual([]);
  });
});
