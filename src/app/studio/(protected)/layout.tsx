import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminGate>
      <section className="section-wrap">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div>{children}</div>
        </div>
      </section>
    </AdminGate>
  );
}
