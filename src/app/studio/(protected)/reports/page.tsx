import { ReportsPanel } from "@/components/admin/ReportsPanel";

export default function AdminReportsPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-[2.25rem] border border-white/75 bg-[linear-gradient(140deg,rgba(255,255,255,0.88),rgba(243,237,225,0.72))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.08)] sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Reports</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Sales and inventory reporting</h1>
      </div>
      <ReportsPanel />
    </div>
  );
}
