import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // motion | broll | ads
  youtubeId: text("youtube_id").notNull(),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  orientation: text("orientation").notNull().default("vertical"), // vertical | landscape
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export type Video = typeof videos.$inferSelect;
