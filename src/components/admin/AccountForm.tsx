"use client";

import { useActionState } from "react";
import { changeCredentials } from "@/app/actions/account";
import Status from "./Status";

export default function AccountForm({ username }: { username: string }) {
  const [state, action, pending] = useActionState(changeCredentials, undefined);
  return (
    <form action={action} className="card max-w-md space-y-4 p-6">
      <label className="block text-sm font-medium text-cream">
        New username
        <input name="username" defaultValue={username} required minLength={3} autoComplete="username" className="field mt-1.5" />
      </label>
      <label className="block text-sm font-medium text-cream">
        New password (8+ characters)
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className="field mt-1.5" />
      </label>
      <label className="block text-sm font-medium text-cream">
        Current password
        <input name="current" type="password" required autoComplete="current-password" className="field mt-1.5" />
      </label>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? "Saving…" : "Update login"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
