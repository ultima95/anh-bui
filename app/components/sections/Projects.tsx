import ProjectCard from "@/app/components/ui/ProjectCard";
import type { ProjectRow } from "@/app/types";

export default function Projects({ data }: { data: ProjectRow[] }) {
  if (data.length === 0) return null;

  return (
    <section
      id="projects"
      className="py-24 px-6 max-w-5xl mx-auto border-t border-black/[0.06]"
    >
      <h2 className="text-xs tracking-widest uppercase text-muted mb-12">
        Projects
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
