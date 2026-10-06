"use client";

import { useActionState } from "react";
import { saveContent } from "@/app/actions/content";
import { CATEGORIES, type Settings } from "@/lib/defaults";
import Status from "./Status";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-cream">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export default function ContentForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveContent, undefined);
  return (
    <form action={action} className="space-y-8">
      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-cream">Hero</h2>
        <Field label="Headline">
          <input name="hero_headline" defaultValue={settings.hero.headline} className="field" />
        </Field>
        <Field label="Intro text">
          <textarea name="hero_subline" defaultValue={settings.hero.subline} rows={3} className="field" />
        </Field>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-cream">Work categories</h2>
        {CATEGORIES.map((c) => (
          <div key={c} className="grid gap-3 sm:grid-cols-[200px_1fr]">
            <Field label="Tab name">
              <input name={`cat_label_${c}`} defaultValue={settings.categories[c].label} className="field" />
            </Field>
            <Field label="Description">
              <input name={`cat_desc_${c}`} defaultValue={settings.categories[c].description} className="field" />
            </Field>
          </div>
        ))}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-cream">Services</h2>
        {settings.services.map((s, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[240px_1fr]">
            <Field label={`Service ${i + 1} title`}>
              <input name={`service_title_${i}`} defaultValue={s.title} className="field" />
            </Field>
            <Field label="Description">
              <input name={`service_body_${i}`} defaultValue={s.body} className="field" />
            </Field>
          </div>
        ))}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-cream">About</h2>
        <Field label="Heading">
          <input name="about_title" defaultValue={settings.about.title} className="field" />
        </Field>
        <Field label="Text (blank line = new paragraph)">
          <textarea name="about_body" defaultValue={settings.about.body} rows={7} className="field" />
        </Field>
        <Field label="Photo link (optional, a direct image URL)">
          <input name="about_photo" defaultValue={settings.about.photoUrl} placeholder="https://…" className="field" />
        </Field>
      </section>

      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Saving…" : "Save content"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
