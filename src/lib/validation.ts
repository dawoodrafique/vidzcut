import { z } from "zod";
import { parseYouTubeId } from "./youtube";

export const videoSchema = z
  .object({
    url: z.string(),
    title: z.string().trim().max(120).default(""),
    subtitle: z.string().trim().max(160).default(""),
    category: z.enum(["motion", "broll", "ads"]),
    orientation: z.enum(["vertical", "landscape"]),
  })
  .transform((v, ctx) => {
    const youtubeId = parseYouTubeId(v.url);
    if (!youtubeId) {
      ctx.addIssue({ code: "custom", message: "Paste a valid YouTube link", path: ["url"] });
      return z.NEVER;
    }
    return { youtubeId, title: v.title, subtitle: v.subtitle, category: v.category, orientation: v.orientation };
  });

export const credentialsSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(40),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  message: z.string().trim().min(1, "Please write a message").max(2000, "Message is too long"),
  website: z.string().max(0), // honeypot: must stay empty
});

export type ActionState = { ok?: boolean; error?: string } | undefined;

export function firstError(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Invalid input";
}
