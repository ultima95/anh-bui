import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-black/[0.06] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              ← View site
            </a>
            <span className="text-black/20">/</span>
            <span className="text-sm font-medium text-foreground">Admin</span>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
