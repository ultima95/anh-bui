import Image from "next/image";
import Link from "next/link";
import type { ProjectRow } from "@/app/types";

export default function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ring-1 ring-black/[0.07] h-full">
        {/* Image */}
        <div className="aspect-video bg-surface overflow-hidden">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={338}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="3" y="6" width="26" height="20" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
                <circle cx="10.5" cy="13" r="2.5" fill="#D1D5DB" />
                <path d="M3 21l7-5 5 5 5-7 7 7" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="font-display font-semibold text-[0.95rem] text-foreground leading-snug">
            {project.title}
          </h3>

          <p className="text-[0.825rem] text-muted leading-relaxed flex-1">
            {project.description}
          </p>

          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-semibold text-foreground/50 bg-black/[0.04] px-2 py-0.5 rounded-md tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-3 border-t border-black/[0.05] mt-1">
            {project.demoUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.demoUrl!, "_blank", "noopener,noreferrer");
                }}
                className="text-[11px] font-semibold text-foreground hover:text-accent transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                Live demo
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {project.githubUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.githubUrl!, "_blank", "noopener,noreferrer");
                }}
                className="text-[11px] font-semibold text-muted hover:text-foreground transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                GitHub
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
