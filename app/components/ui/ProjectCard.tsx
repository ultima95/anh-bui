import Image from "next/image";
import type { ProjectRow } from "@/app/types";

export default function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <article className="group flex flex-col bg-white border border-black/[0.08] rounded-2xl overflow-hidden hover:border-black/20 hover:shadow-lg transition-all duration-300">
      {/* Image / placeholder */}
      <div className="aspect-video bg-surface overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-black/[0.06] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="#9CA3AF" strokeWidth="1.5" />
                <circle cx="7" cy="8.5" r="1.5" fill="#9CA3AF" />
                <path d="M2 13l4-3 3 3 3-4 4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base text-foreground leading-snug">
            {project.title}
          </h3>
          {project.featured && (
            <span className="flex-shrink-0 text-[10px] font-medium tracking-wider uppercase text-accent border border-accent/30 bg-accent/5 px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        <p className="text-sm text-muted leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium text-foreground/60 bg-black/[0.04] px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-2 border-t border-black/[0.06] mt-1">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              Live demo
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1"
            >
              GitHub
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
