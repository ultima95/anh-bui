import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <p className="font-display text-xs font-bold text-accent tracking-wider mb-6">404</p>
      <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
        Page not found.
      </h1>
      <p className="text-muted text-base mb-10">
        This page doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors"
      >
        ← Back home
      </Link>
    </div>
  );
}
