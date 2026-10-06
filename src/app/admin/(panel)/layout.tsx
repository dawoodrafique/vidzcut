import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Dashboard", robots: { index: false } };

const nav = [
  { href: "/admin", label: "Videos" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/account", label: "Account" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { username } = await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[#0b2a35]/90">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="font-display text-lg font-bold text-cream">Dashboard</span>
          <nav aria-label="Dashboard" className="flex flex-wrap items-center gap-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-cream hover:bg-white/5">
                {n.label}
              </Link>
            ))}
            <Link href="/" target="_blank" className="rounded-lg px-3 py-2 text-sm text-gold hover:bg-white/5">
              View site ↗
            </Link>
            <form action={logout}>
              <button className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5" title={`Signed in as ${username}`}>
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container-x py-10">{children}</main>
    </div>
  );
}
