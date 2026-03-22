export function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/45">
      <div className="mx-auto grid max-w-7xl gap-3 px-6 py-10 text-sm text-[var(--muted)] md:grid-cols-2">
        <div>
          <p className="font-semibold tracking-[0.22em] uppercase text-[var(--foreground)]">Kane & Kaori</p>
          <p className="mt-2 max-w-md">A fragrance house rooted in Ikigai (生き甲斐) and Kaizen (改善), creating scents that carry memory, purpose, and quiet beauty.</p>
        </div>
        <div className="md:text-right">
          <p>Thoughtful fragrances</p>
          <p>Purposeful craft</p>
          <p>Continuous refinement</p>
        </div>
      </div>
    </footer>
  );
}
