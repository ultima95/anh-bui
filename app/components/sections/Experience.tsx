import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { ExperienceRow } from "@/app/types";

export default function Experience({ data }: { data: ExperienceRow[] }) {
  if (data.length === 0) return null;

  return (
    <section id="experience" className="py-28 px-6 max-w-5xl mx-auto border-t border-black/[0.06]">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-14">
          <span className="font-display text-xs font-bold text-accent tracking-wider">04</span>
          <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">Experience</h2>
        </div>
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
