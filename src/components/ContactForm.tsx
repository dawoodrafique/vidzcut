"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[24px] border border-white/15 bg-white/5 p-8 text-center" role="status">
        <p className="font-display text-2xl font-bold text-white">Message sent.</p>
        <p className="mt-2 text-white/70">Thanks! I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4 rounded-[24px] border border-white/15 bg-white/5 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white">
          Name
          <input name="name" required maxLength={100} autoComplete="name" className="field mt-1.5" placeholder="Your name" />
        </label>
        <label className="block text-sm font-medium text-white">
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" className="field mt-1.5" placeholder="you@example.com" />
        </label>
      </div>
      <label className="block text-sm font-medium text-white">
        Tell me about your project
        <textarea name="message" required maxLength={2000} rows={5} className="field mt-1.5" placeholder="Video type, length, deadline, links to footage…" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="btn btn-gold w-full disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
