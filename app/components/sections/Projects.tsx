import ProjectCard from "@/app/components/ui/ProjectCard";
import FeaturedProjectCard from "@/app/components/ui/FeaturedProjectCard";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { ProjectRow } from "@/app/types";

export default function Projects({ data }: { data: ProjectRow[] }) {
  if (data.length === 0) return null;

  const featured = data.filter((p) => p.featured);
  const regular  = data.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-28 px-6 max-w-5xl mx-auto border-t border-black/[0.06]">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-14">
          <span className="font-display text-xs font-bold text-accent tracking-wider">02</span>
          <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">Projects</h2>
        </div>
      </ScrollReveal>

      {/* Featured — horizontal cards */}
      {featured.length > 0 && (
        <div className="flex flex-col gap-6 mb-10">
          {featured.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 80}>
              <FeaturedProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Regular — grid */}
      {regular.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regular.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 60}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
