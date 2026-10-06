import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;
let cached: { db: Db; ready: Promise<void> } | null = null;

/** Returns the Drizzle client, or null when DATABASE_URL is not configured. Creates tables on first use. */
export async function getDb(): Promise<Db | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!cached) {
    const sql = neon(url);
    const ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS admins (id serial PRIMARY KEY, username text NOT NULL UNIQUE, password_hash text NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS videos (id serial PRIMARY KEY, category text NOT NULL, youtube_id text NOT NULL, title text NOT NULL DEFAULT '', subtitle text NOT NULL DEFAULT '', orientation text NOT NULL DEFAULT 'vertical', sort_order integer NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now())`;
      await sql`CREATE TABLE IF NOT EXISTS settings (key text PRIMARY KEY, value jsonb NOT NULL)`;
    })();
    cached = { db: drizzle(sql, { schema }), ready };
    ready.catch(() => {
      cached = null;
    });
  }
  await cached.ready;
  return cached.db;
}
