"use server";

import { revalidatePath } from "next/cache";
import { asc, eq, max } from "drizzle-orm";
import { getDb } from "@/db";
import { videos } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { firstError, videoSchema, type ActionState } from "@/lib/validation";

function parseForm(formData: FormData) {
  return videoSchema.safeParse({
    url: String(formData.get("url") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    category: String(formData.get("category") ?? ""),
    orientation: String(formData.get("orientation") ?? ""),
  });
}

async function dbOrThrow() {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  return db;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addVideo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };
  const db = await dbOrThrow();
  const [{ top }] = await db
    .select({ top: max(videos.sortOrder) })
    .from(videos)
    .where(eq(videos.category, parsed.data.category));
  await db.insert(videos).values({ ...parsed.data, sortOrder: (top ?? -1) + 1 });
  refresh();
  return { ok: true };
}

export async function updateVideo(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };
  const db = await dbOrThrow();
  await db.update(videos).set(parsed.data).where(eq(videos.id, id));
  refresh();
  return { ok: true };
}

export async function deleteVideo(id: number): Promise<void> {
  await requireAdmin();
  const db = await dbOrThrow();
  await db.delete(videos).where(eq(videos.id, id));
  refresh();
}

export async function toggleVideo(id: number): Promise<void> {
  await requireAdmin();
  const db = await dbOrThrow();
  const [v] = await db.select().from(videos).where(eq(videos.id, id));
  if (v) await db.update(videos).set({ visible: !v.visible }).where(eq(videos.id, id));
  refresh();
}

export async function moveVideo(id: number, dir: "up" | "down"): Promise<void> {
  await requireAdmin();
  const db = await dbOrThrow();
  const [v] = await db.select().from(videos).where(eq(videos.id, id));
  if (!v) return;
  const list = await db
    .select()
    .from(videos)
    .where(eq(videos.category, v.category))
    .orderBy(asc(videos.sortOrder), asc(videos.id));
  const i = list.findIndex((x) => x.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((x, idx) => db.update(videos).set({ sortOrder: idx }).where(eq(videos.id, x.id))));
  refresh();
}
