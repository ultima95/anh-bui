import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { ExperienceRow } from "@/app/types";

export default function Experience({ data }: { data: ExperienceRow[] }) {
  if (data.length === 0) return null;

  return (
    <section id="experience" className="py-28 px-6 max-w-5xl mx-auto border-t border-black/[0.06] overflow-hidden relative">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-14">
          <span className="font-display text-xs font-bold text-accent tracking-wider">04</span>
          <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">Experience</h2>
        </div>
        {/* Drawn accent rule */}
        <div
          className="w-12 h-px bg-accent/30 origin-left mt-3"
          aria-hidden="true"
          style={{ animation: "drawLine 0.5s ease 0.14s both" }}
        />
      </ScrollReveal>

      <ol className="relative space-y-0">
        {/* Vertical line */}
        <li className="absolute left-[6px] top-3 bottom-3 w-px bg-black/[0.08] hidden sm:block pointer-events-none" aria-hidden="true" />

        {data.map((entry, i) => (
          <ScrollReveal key={entry.id} delay={i * 80}>
            <li className="relative sm:pl-10 pb-12 last:pb-0">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-2 w-[13px] h-[13px] rounded-full bg-background ring-2 ring-accent hidden sm:block"
                aria-hidden="true"
              />

              {/* Ghost start year */}
              <div
                className="absolute right-0 top-0 pointer-events-none select-none hidden sm:block"
                aria-hidden="true"
              >
                <span className="font-display font-black text-[clamp(3rem,7vw,6rem)] leading-none text-foreground opacity-[0.04] block tabular-nums">
                  {entry.startDate.slice(0, 4)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-base text-foreground leading-snug">
                    {entry.position}
                  </h3>
                  <p className="text-sm text-muted mt-0.5">
                    {entry.company}
                    {entry.location && (
                      <span className="text-muted/60"> · {entry.location}</span>
                    )}
                  </p>
                  {/* Drawn accent rule under position title */}
                  <div
                    className="w-8 h-px bg-accent/30 origin-left mt-2"
                    aria-hidden="true"
                    style={{ animation: "drawLine 0.4s ease 0.1s both" }}
                  />
                </div>
                <span className="text-xs text-muted/70 font-medium whitespace-nowrap tabular-nums sm:ml-6 shrink-0">
                  {entry.startDate} — {entry.endDate ?? "Present"}
                </span>
              </div>

              <p className="text-sm leading-[1.75] text-foreground/70">
                {entry.description}
              </p>
            </li>
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
