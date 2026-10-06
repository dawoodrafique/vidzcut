import { describe, it, expect } from "vitest";
import { videoSchema, credentialsSchema, contactSchema } from "@/lib/validation";

const good = { url: "https://youtu.be/dQw4w9WgXcQ", title: "Promo", subtitle: "Brand", category: "ads", orientation: "vertical" };

describe("videoSchema", () => {
  it("accepts a valid video and extracts the id", () => {
    const r = videoSchema.safeParse(good);
    expect(r.success && r.data.youtubeId).toBe("dQw4w9WgXcQ");
  });
  it.each(["", "hello", "https://vimeo.com/1"])("rejects url %s", (url) => {
    expect(videoSchema.safeParse({ ...good, url }).success).toBe(false);
  });
  it("rejects unknown category/orientation", () => {
    expect(videoSchema.safeParse({ ...good, category: "x" }).success).toBe(false);
    expect(videoSchema.safeParse({ ...good, orientation: "square" }).success).toBe(false);
  });
});

describe("credentialsSchema", () => {
  it("requires username>=3 and password>=8", () => {
    expect(credentialsSchema.safeParse({ username: "ab", password: "longenough1" }).success).toBe(false);
    expect(credentialsSchema.safeParse({ username: "moizza", password: "short" }).success).toBe(false);
    expect(credentialsSchema.safeParse({ username: "moizza", password: "longenough1" }).success).toBe(true);
  });
});

describe("contactSchema", () => {
  const ok = { name: "Ann", email: "ann@example.com", message: "Hi there", website: "" };
  it("accepts valid", () => expect(contactSchema.safeParse(ok).success).toBe(true));
  it("rejects empty name/message, bad email, huge message, filled honeypot", () => {
    expect(contactSchema.safeParse({ ...ok, name: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, message: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, message: "x".repeat(10000) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...ok, website: "spam.com" }).success).toBe(false);
  });
});
