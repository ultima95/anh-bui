import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { SkillRow } from "@/app/types";

export default function Skills({ data }: { data: SkillRow[] }) {
  if (data.length === 0) return null;

  const grouped = data.reduce<Record<string, SkillRow[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-28 px-6 max-w-5xl mx-auto border-t border-black/[0.06]">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-14">
          <span className="font-display text-xs font-bold text-accent tracking-wider">03</span>
          <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">Skills</h2>
        </div>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
        {Object.entries(grouped).map(([category, categorySkills], i) => (
          <ScrollReveal key={category} delay={i * 80}>
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted/50 mb-5">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <li key={skill.id} className="inline-flex">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/[0.05] text-foreground/80 border border-black/[0.07]"
                      aria-label={skill.name}
                    >
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
