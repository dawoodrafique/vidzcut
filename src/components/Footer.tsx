export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-8">
      <div className="container-x flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <span className="font-display font-bold text-cream">Moizza Fatima</span>
        <span>© {new Date().getFullYear()} Moizza Fatima. Video editor.</span>
      </div>
    </footer>
  );
}
