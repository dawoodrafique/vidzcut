"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { admins } from "@/db/schema";
import { hashPassword, requireAdmin, startSession, verifyPassword } from "@/lib/auth";
import { credentialsSchema, firstError, type ActionState } from "@/lib/validation";

export async function changeCredentials(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = credentialsSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const db = await getDb();
  if (!db) return { error: "Database is not configured" };
  const [admin] = await db.select().from(admins).where(eq(admins.username, session.username)).limit(1);
  if (!admin || !(await verifyPassword(String(formData.get("current") ?? ""), admin.passwordHash))) {
    return { error: "Current password is incorrect" };
  }
  try {
    await db
      .update(admins)
      .set({ username: parsed.data.username, passwordHash: await hashPassword(parsed.data.password) })
      .where(eq(admins.id, admin.id));
  } catch {
    return { error: "That username is not available" };
  }
  await startSession(parsed.data.username);
  return { ok: true };
}
