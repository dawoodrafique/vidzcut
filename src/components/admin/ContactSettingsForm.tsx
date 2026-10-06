"use client";

import { useActionState } from "react";
import { saveContact } from "@/app/actions/content";
import type { Settings } from "@/lib/defaults";
import Status from "./Status";

export default function ContactSettingsForm({ contact }: { contact: Settings["contact"] }) {
  const [state, action, pending] = useActionState(saveContact, undefined);
  return (
    <form action={action} className="card max-w-xl space-y-4 p-6">
      {(
        [
          ["email", "Email", "name@gmail.com"],
          ["phone", "Phone number", "+92 300 1234567"],
          ["whatsapp", "WhatsApp number (with country code)", "+92 300 1234567"],
          ["instagram", "Instagram (username or link)", "@username"],
        ] as const
      ).map(([name, label, ph]) => (
        <label key={name} className="block text-sm font-medium text-cream">
          {label}
          <input name={name} defaultValue={contact[name]} placeholder={ph} className="field mt-1.5" />
        </label>
      ))}
      <label className="flex items-start gap-3 text-sm text-cream">
        <input type="checkbox" name="formEnabled" defaultChecked={contact.formEnabled} className="mt-1 h-4 w-4 accent-[#f9bf4b]" />
        <span>
          Show a contact form on the site
          <span className="block text-[var(--muted)]">Messages are emailed to the address above (needs the Gmail App Password set up).</span>
        </span>
      </label>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Saving…" : "Save contact details"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
