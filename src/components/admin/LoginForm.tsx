"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Status from "./Status";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="card w-full max-w-sm space-y-4 p-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="text-sm text-ink-2">Sign in to manage your portfolio.</p>
      <label className="block text-sm font-medium text-ink">
        Username
        <input name="username" required autoComplete="username" className="field mt-1.5" />
      </label>
      <label className="block text-sm font-medium text-ink">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="field mt-1.5" />
      </label>
      <Status state={state?.error ? state : undefined} />
      <button type="submit" disabled={pending} className="btn btn-gold w-full disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
