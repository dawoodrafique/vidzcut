"use client";

import { useActionState, useEffect, useRef } from "react";
import { addVideo } from "@/app/actions/videos";
import type { Category } from "@/lib/defaults";
import Status from "./Status";

export default function AddVideoForm({ category }: { category: Category }) {
  const [state, action, pending] = useActionState(addVideo, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="card space-y-4 p-6">
      <h2 className="font-display text-xl font-bold text-cream">Add a video</h2>
      <input type="hidden" name="category" value={category} />
      <label className="block text-sm font-medium text-cream">
        YouTube link
        <input name="url" required placeholder="https://youtube.com/shorts/…" className="field mt-1.5" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-cream">
          Title
          <input name="title" maxLength={120} className="field mt-1.5" placeholder="Project title" />
        </label>
        <label className="block text-sm font-medium text-cream">
          Subtitle
          <input name="subtitle" maxLength={160} className="field mt-1.5" placeholder="Client type · what you did" />
        </label>
      </div>
      <label className="block text-sm font-medium text-cream">
        Shape
        <select name="orientation" className="field mt-1.5" defaultValue="vertical">
          <option value="vertical">Vertical reel (9:16)</option>
          <option value="landscape">Landscape (16:9)</option>
        </select>
      </label>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Adding…" : "Add video"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
