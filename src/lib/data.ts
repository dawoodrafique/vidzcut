import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { settings as settingsTable, videos as videosTable, type Video } from "@/db/schema";
import { defaultSettings, type Category, type Settings } from "./defaults";

export type { Video };

/** Settings from the DB merged over defaults. Falls back to defaults on any error. */
export async function getSettings(): Promise<Settings> {
  try {
    const db = await getDb();
    if (!db) return defaultSettings;
    const rows = await db.select().from(settingsTable);
    const merged: Record<string, unknown> = { ...defaultSettings };
    for (const row of rows) {
      const base = (defaultSettings as Record<string, unknown>)[row.key];
      if (base === undefined) continue;
      merged[row.key] = Array.isArray(base)
        ? row.value
        : { ...(base as object), ...(row.value as object) };
    }
    return merged as Settings;
  } catch (err) {
    console.error("getSettings failed", err);
    return defaultSettings;
  }
}

export async function saveSettingsKey<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
}

export async function getVideos(
  category?: Category,
  opts: { includeHidden?: boolean } = {},
): Promise<Video[]> {
  try {
    const db = await getDb();
    if (!db) return process.env.NODE_ENV === "development" ? devSampleVideos(category) : [];
    const rows = await db
      .select()
      .from(videosTable)
      .where(category ? eq(videosTable.category, category) : undefined)
      .orderBy(asc(videosTable.sortOrder), asc(videosTable.id));
    return opts.includeHidden ? rows : rows.filter((v) => v.visible);
  } catch (err) {
    console.error("getVideos failed", err);
    return [];
  }
}

/** Local preview only: shown when no DATABASE_URL is set and `next dev` is running. */
function devSampleVideos(category?: Category): Video[] {
  const ids = ["jNQXAC9IVRw", "aqz-KE-bpKQ", "YE7VzlLtp-4", "jNQXAC9IVRw", "aqz-KE-bpKQ", "YE7VzlLtp-4"];
  const all: Video[] = (["motion", "broll", "ads"] as const).flatMap((c, ci) =>
    ids.map((id, i) => ({
      id: ci * 10 + i + 1,
      category: c,
      youtubeId: id,
      title: "Project title",
      subtitle: "Client type · what you did",
      orientation: "vertical" as const,
      sortOrder: i,
      visible: true,
      createdAt: new Date(0),
    })),
  );
  return category ? all.filter((v) => v.category === category) : all;
}
