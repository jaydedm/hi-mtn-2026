import { AdminShell } from "./_components/admin-shell";

// Admin pages read live data from the database; never prerender them at build time.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
