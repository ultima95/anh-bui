import type { ExperienceRow } from "@/app/types";

export default function Experience({ data }: { data: ExperienceRow[] }) {
  if (data.length === 0) return null;

  return (
    <section
      id="experience"
      className="py-24 px-6 max-w-5xl mx-auto border-t border-black/[0.06]"
    >
      <h2 className="text-xs tracking-widest uppercase text-muted mb-12">
        Experience
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute left-[7px] top-2 bottom-0 w-px bg-black/[0.08] hidden sm:block"
          aria-hidden="true"
        />

        <ol className="space-y-10">
          {data.map((entry) => (
            <li key={entry.id} className="sm:pl-8 relative">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-accent hidden sm:block"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <div>
                  <h3 className="font-semibold text-base text-foreground leading-snug">
                    {entry.position}
                  </h3>
                  <p className="text-sm text-muted mt-0.5">
                    {entry.company}
                    {entry.location && ` · ${entry.location}`}
                  </p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap font-medium">
                  {entry.startDate} — {entry.endDate ?? "Present"}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-foreground/75">
                {entry.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
