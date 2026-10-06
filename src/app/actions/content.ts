"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getSettings, saveSettingsKey } from "@/lib/data";
import { CATEGORIES, type ServiceItem } from "@/lib/defaults";
import type { ActionState } from "@/lib/validation";

const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);

export async function saveContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const current = await getSettings();
  try {
    await saveSettingsKey("hero", {
      headline: str(formData, "hero_headline", 200) || current.hero.headline,
      subline: str(formData, "hero_subline", 500),
    });
    await saveSettingsKey("about", {
      title: str(formData, "about_title", 120),
      body: str(formData, "about_body", 4000),
      photoUrl: str(formData, "about_photo", 500),
    });
    const services: ServiceItem[] = current.services.map((s, i) => ({
      ...s,
      title: str(formData, `service_title_${i}`, 120) || s.title,
      body: str(formData, `service_body_${i}`, 400) || s.body,
    }));
    await saveSettingsKey("services", services);
    const categories = { ...current.categories };
    for (const c of CATEGORIES) {
      categories[c] = {
        label: str(formData, `cat_label_${c}`, 40) || current.categories[c].label,
        description: str(formData, `cat_desc_${c}`, 300),
      };
    }
    await saveSettingsKey("categories", categories);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save" };
  }
  revalidatePath("/");
  return { ok: true };
}

export async function saveContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    await saveSettingsKey("contact", {
      email: str(formData, "email", 200),
      phone: str(formData, "phone", 50),
      whatsapp: str(formData, "whatsapp", 50),
      instagram: str(formData, "instagram", 200),
      formEnabled: formData.get("formEnabled") === "on",
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save" };
  }
  revalidatePath("/");
  return { ok: true };
}
