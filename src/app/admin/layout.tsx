import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-forest-dark text-cream px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif text-lg font-bold text-mustard">
            Admin Dashboard
          </Link>
          <Link href="/" className="text-sm text-cream/70 hover:text-cream">
            ← Back to site
          </Link>
        </div>
        <UserButton />
      </header>
      <div className="max-w-4xl mx-auto py-10 px-6">{children}</div>
    </div>
  );
}
