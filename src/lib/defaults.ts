export type Category = "motion" | "broll" | "ads";
export type Orientation = "vertical" | "landscape";
export const CATEGORIES: Category[] = ["motion", "broll", "ads"];

export type ServiceItem = { title: string; body: string; icon: "scissors" | "captions" | "grid" | "wave" };

export type Settings = {
  hero: { headline: string; subline: string };
  about: { title: string; body: string; photoUrl: string };
  services: ServiceItem[];
  categories: Record<Category, { label: string; description: string }>;
  contact: { email: string; phone: string; whatsapp: string; instagram: string; formEnabled: boolean };
};

export const defaultSettings: Settings = {
  hero: {
    headline: "Edits that hold attention from the first second.",
    subline:
      "I'm Moizza, a video editor for creators and brands. Sharp cuts, clean sound, and motion that keeps people watching.",
  },
  about: {
    title: "Hi, I'm Moizza.",
    body:
      "I edit videos for creators and brands who want their content to feel sharp and keep people watching. From talking heads to ads, I handle the cutting, sound and motion so you can focus on the message.\n\nSend me raw footage and a few notes, and I'll send back something ready to publish.",
    photoUrl: "",
  },
  services: [
    { title: "Cutting and pacing", body: "Pauses, stumbles, and tangents removed. Your natural voice stays.", icon: "scissors" },
    { title: "Captions", body: "Accurate, styled subtitles for Shorts, Reels, and TikTok.", icon: "captions" },
    { title: "Motion graphics and B-roll", body: "Animated text, cutaways, and visuals that back up what you say.", icon: "grid" },
    { title: "Audio cleanup", body: "Noise reduction, balanced levels, and music that sits under your voice.", icon: "wave" },
  ],
  categories: {
    motion: { label: "Motion graphics", description: "Talking heads with animated text and visuals that explain ideas on screen." },
    broll: { label: "B-roll", description: "Talking heads built around cutaways and footage that keep the story moving." },
    ads: { label: "Ads", description: "Short, direct-response videos made to hold attention." },
  },
  contact: { email: "", phone: "", whatsapp: "", instagram: "", formEnabled: false },
};
