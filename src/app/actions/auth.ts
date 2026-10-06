"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { admins } from "@/db/schema";
import { checkRateLimit, endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";
import type { ActionState } from "@/lib/validation";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const db = await getDb();
  if (!db) return { error: "Database is not configured (set DATABASE_URL)." };

  let [admin] = await db.select().from(admins).limit(1);
  if (!admin) {
    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;
    if (!envUser || !envPass || username !== envUser || password !== envPass) {
      return { error: "Invalid username or password." };
    }
    [admin] = await db
      .insert(admins)
      .values({ username: envUser, passwordHash: await hashPassword(envPass) })
      .returning();
  } else if (admin.username !== username || !(await verifyPassword(password, admin.passwordHash))) {
    return { error: "Invalid username or password." };
  }

  await startSession(admin.username);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
