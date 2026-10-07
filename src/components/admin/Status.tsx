import type { ActionState } from "@/lib/validation";

export default function Status({ state }: { state: ActionState }) {
  if (!state) return null;
  if (state.error)
    return (
      <p role="alert" className="text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p role="status" className="text-sm text-emerald-700">
        Saved.
      </p>
    );
  return null;
}
