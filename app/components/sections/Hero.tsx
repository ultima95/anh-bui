import type { HeroRow } from "@/app/types";

export default function Hero({ data }: { data: HeroRow | null }) {
  if (!data) return null;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden"
      aria-label="Introduction"
    >
      {/* Dot-grid background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft radial fade — keeps centre of hero clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 40% 50%, transparent 30%, var(--background) 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto w-full pt-24 pb-20">
        {/* Availability badge */}
        <div
          style={{ animation: "fadeUp 0.6s ease both" }}
          className="inline-flex items-center gap-2 border border-black/10 bg-white/70 backdrop-blur-sm rounded-full px-3.5 py-1.5 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground/70">Available for opportunities</span>
        </div>

        {/* Role label */}
        <p
          style={{ animation: "fadeUp 0.7s ease 0.08s both" }}
          className="font-display text-sm font-medium tracking-[0.2em] uppercase text-muted mb-5 select-none"
        >
          Frontend Developer
        </p>

        {/* Name — display typeface */}
        <h1
          style={{ animation: "fadeUp 0.8s ease 0.16s both" }}
          className="font-display font-black text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-tight text-foreground mb-8"
        >
          <span className="relative inline-block">
            {data.name}
            <span
              className="absolute bottom-2 left-0 w-full h-1 bg-accent origin-left"
              aria-hidden="true"
              style={{ animation: "heroLine 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s both" }}
            />
          </span>
        </h1>

        {/* Description */}
        <p
          style={{ animation: "fadeUp 0.8s ease 0.28s both" }}
          className="text-lg sm:text-xl text-muted leading-relaxed max-w-[520px] mb-12"
        >
          {data.description}
        </p>

        {/* CTAs */}
        <div
          style={{ animation: "fadeUp 0.8s ease 0.38s both" }}
          className="flex flex-wrap gap-3"
        >
          <a
            href={data.ctaUrl}
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold hover:bg-foreground/85 active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            {data.ctaText}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {data.resumeUrl && (
            <a
              href={data.resumeUrl}
              className="inline-flex items-center gap-2 border border-black/20 text-foreground px-6 py-3 rounded-full text-sm font-semibold hover:border-black/40 hover:bg-black/[0.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              Resume
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
        style={{ animation: "fadeIn 0.8s ease 1.4s both" }}
      >
        <span className="text-[10px] tracking-[0.18em] uppercase text-muted/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-muted/30 to-transparent" />
      </div>
    </section>
  );
}
