import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword, signSession, verifySession, checkRateLimit } from "@/lib/auth";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-test-secret-test-secret";
});

describe("passwords", () => {
  it("hashes and verifies", async () => {
    const h = await hashPassword("hunter2hunter2");
    expect(h).not.toBe("hunter2hunter2");
    expect(await verifyPassword("hunter2hunter2", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
});

describe("sessions", () => {
  it("round-trips a session", async () => {
    expect(await verifySession(await signSession("moizza"))).toEqual({ username: "moizza" });
  });
  it("rejects tampered and empty tokens", async () => {
    const t = await signSession("moizza");
    expect(await verifySession(t.slice(0, -2) + "xx")).toBeNull();
    expect(await verifySession("")).toBeNull();
    expect(await verifySession("garbage")).toBeNull();
  });
});

describe("rate limit", () => {
  it("allows max attempts then blocks", () => {
    for (let i = 0; i < 5; i++) expect(checkRateLimit("ip-a", 5, 60000)).toBe(true);
    expect(checkRateLimit("ip-a", 5, 60000)).toBe(false);
    expect(checkRateLimit("ip-b", 5, 60000)).toBe(true);
  });
});
