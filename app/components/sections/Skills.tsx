import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { SkillRow } from "@/app/types";

function SkillBar({ name, level }: { name: string; level: number }) {
  const pct = Math.round((level / 5) * 100);
  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-[11px] text-muted tabular-nums">{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full bg-black/[0.07] overflow-hidden" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={5} aria-label={`${name} proficiency`}>
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

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
              <ul className="space-y-4">
                {categorySkills.map((skill) => (
                  <SkillBar key={skill.id} name={skill.name} level={skill.proficiencyLevel} />
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
