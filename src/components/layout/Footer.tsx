export function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/45">
      <div className="mx-auto grid max-w-7xl gap-3 px-6 py-10 text-sm text-[var(--muted)] md:grid-cols-2">
        <div>
          <p className="font-semibold tracking-[0.22em] uppercase text-[var(--foreground)]">Kane & Kaori</p>
          <p className="mt-2 max-w-md">A modern fragrance house built for intimate gifting, elegant rituals, and memorable first impressions.</p>
        </div>
        <div className="md:text-right">
          <p>Guest checkout enabled</p>
          <p>Admin-managed catalog</p>
          <p>Built with Next.js for a fast storefront</p>
        </div>
      </div>
    </footer>
  );
}
