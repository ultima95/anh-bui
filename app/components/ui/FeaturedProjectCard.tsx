import Image from "next/image";
import Link from "next/link";
import type { ProjectRow } from "@/app/types";

export default function FeaturedProjectCard({ project }: { project: ProjectRow }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="grid md:grid-cols-[1.1fr_1fr] gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ring-1 ring-black/[0.07]">
        {/* Image — left side on desktop */}
        <div className="aspect-video md:aspect-auto bg-surface overflow-hidden">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={720}
              height={480}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <rect x="4" y="8" width="32" height="24" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
                <circle cx="13" cy="16" r="3" fill="#D1D5DB" />
                <path d="M4 26l8-6 6 6 6-8 8 8" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Content — right side on desktop */}
        <div className="flex flex-col justify-between p-7 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-accent border border-accent/25 bg-accent/8 px-2 py-0.5 rounded-full">
                Featured
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-foreground leading-tight">
              {project.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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

            <div className="flex items-center gap-5 pt-4 border-t border-black/[0.05]">
              {project.demoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.demoUrl!, "_blank", "noopener,noreferrer");
                  }}
                  className="text-sm font-semibold text-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Live demo
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                  className="text-sm font-semibold text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  GitHub
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
