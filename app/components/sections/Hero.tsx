import type { HeroRow } from "@/app/types";

export default function Hero({ data }: { data: HeroRow | null }) {
  if (!data) return null;

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto"
    >
      <div
        style={{ animation: "fadeUp 0.8s ease both" }}
        className="max-w-3xl"
      >
        <p
          style={{ animation: "fadeUp 0.8s ease 0.1s both" }}
          className="text-sm tracking-widest uppercase text-muted mb-6"
        >
          Frontend Developer
        </p>

        <h1
          style={{ animation: "fadeUp 0.8s ease 0.2s both" }}
          className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] mb-8"
        >
          <span className="relative inline-block">
            {data.name}
            <span
              className="absolute bottom-1 left-0 right-0 h-[3px] bg-accent"
              aria-hidden="true"
            />
          </span>
        </h1>

        <p
          style={{ animation: "fadeUp 0.8s ease 0.3s both" }}
          className="text-lg sm:text-xl text-muted max-w-xl leading-relaxed mb-10"
        >
          {data.description}
        </p>

        <div
          style={{ animation: "fadeUp 0.8s ease 0.4s both" }}
          className="flex flex-wrap gap-4"
        >
          <a
            href={data.ctaUrl}
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:bg-foreground/80 transition-colors"
          >
            {data.ctaText}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {data.resumeUrl && (
            <a
              href={data.resumeUrl}
              className="inline-flex items-center gap-2 border border-black/20 text-foreground px-6 py-3 rounded-full text-sm font-medium hover:border-black/40 transition-colors"
            >
              Resume
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{ animation: "fadeIn 1s ease 1.2s both" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs text-muted tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted/40 to-transparent" />
      </div>
    </section>
  );
}
