import type { SkillRow } from "@/app/types";

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-label={`Proficiency: ${level} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < level ? "bg-accent" : "bg-black/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function Skills({ data }: { data: SkillRow[] }) {
  if (data.length === 0) return null;

  // Group by category preserving display order
  const grouped = data.reduce<Record<string, SkillRow[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section
      id="skills"
      className="py-24 px-6 max-w-5xl mx-auto border-t border-black/[0.06]"
    >
      <h2 className="text-xs tracking-widest uppercase text-muted mb-12">
        Skills
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {Object.entries(grouped).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-xs font-medium tracking-wider uppercase text-muted/60 mb-4">
              {category}
            </h3>
            <ul className="space-y-3">
              {categorySkills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {skill.name}
                  </span>
                  <ProficiencyDots level={skill.proficiencyLevel} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
