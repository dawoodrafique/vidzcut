export default function Footer() {
  return (
    <footer className="on-dark bg-[#082029] py-8 text-white">
      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-white/60">
        <span className="font-display font-bold text-white">Moizza Fatima</span>
        <span>© {new Date().getFullYear()} Moizza Fatima. Video editor.</span>
      </div>
    </footer>
  );
}
