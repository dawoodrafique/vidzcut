import AccountForm from "@/components/admin/AccountForm";
import { requireAdmin } from "@/lib/auth";

export default async function AccountPage() {
  const { username } = await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-cream">Account</h1>
      <p className="text-[var(--muted)]">Change the username and password used to sign in to this dashboard.</p>
      <AccountForm username={username} />
    </div>
  );
}
