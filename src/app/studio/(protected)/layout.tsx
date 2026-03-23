import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminGate>
      <section className="section-wrap studio-shell">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </AdminGate>
  );
}
