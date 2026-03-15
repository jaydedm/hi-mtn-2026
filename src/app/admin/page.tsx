import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-brand text-3xl font-bold text-forest-dark">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/hours"
          className="block bg-card border border-border rounded-lg p-6 hover:border-mustard transition-colors"
        >
          <h2 className="font-brand text-xl font-bold text-forest-dark mb-2">
            Operating Hours
          </h2>
          <p className="text-muted-foreground">Edit open and close times for each day.</p>
        </Link>
        <Link
          href="/admin/banner"
          className="block bg-card border border-border rounded-lg p-6 hover:border-mustard transition-colors"
        >
          <h2 className="font-brand text-xl font-bold text-forest-dark mb-2">
            Global Banner
          </h2>
          <p className="text-muted-foreground">Manage site-wide announcements.</p>
        </Link>
        <Link
          href="/admin/menu"
          className="block bg-card border border-border rounded-lg p-6 hover:border-mustard transition-colors"
        >
          <h2 className="font-brand text-xl font-bold text-forest-dark mb-2">
            Menu PDFs
          </h2>
          <p className="text-muted-foreground">Upload and manage menu PDFs.</p>
        </Link>
      </div>
    </div>
  );
}
