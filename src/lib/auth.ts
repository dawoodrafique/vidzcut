import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export { signSession, verifySession, SESSION_COOKIE };

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Server-side guard: returns the logged-in admin or redirects to the login page. */
export async function requireAdmin(): Promise<{ username: string }> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const session = await verifySession(token);
  if (!session) redirect("/admin/login");
  return session;
}

export async function startSession(username: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, await signSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

const hits = new Map<string, number[]>();

/** In-memory sliding-window limiter. Returns false once `max` hits happen within `windowMs`. */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
