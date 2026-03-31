"use client";

import type { ProjectRow } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProjectCard({
  project,
}: {
  project: ProjectRow;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block group"
      aria-label={`View ${project.title} project`}
    >
      <article className="grid md:grid-cols-[1.1fr_1fr] gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-black/[0.07] hover:-translate-y-0.5 will-change-transform">
        {/* Image — left side on desktop */}
        <div className="relative aspect-video md:aspect-auto overflow-hidden">
          {project.imageUrl ? (
            <>
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={720}
                height={480}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50/60">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="8"
                  width="32"
                  height="24"
                  rx="3"
                  stroke="#D4B896"
                  strokeWidth="1.5"
                />
                <circle cx="13" cy="16" r="3" fill="#D4B896" />
                <path
                  d="M4 26l8-6 6 6 6-8 8 8"
                  stroke="#D4B896"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content — right side on desktop */}
        <div className="flex flex-col justify-between p-7 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-accent border border-accent/25 bg-accent/8 px-2.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-accent/70 flex-shrink-0" aria-hidden="true" />
                Featured
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-foreground leading-tight group-hover:text-accent/90 transition-colors duration-200">
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
                    className="text-[10px] font-semibold text-foreground/50 bg-black/[0.04] hover:bg-accent/8 hover:text-accent/70 transition-colors duration-150 px-2 py-0.5 rounded-md tracking-wide"
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
                    window.open(
                      project.demoUrl!,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="text-sm font-semibold text-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer group/btn"
                >
                  <span className="relative">
                    Live demo
                    <span className="absolute -bottom-px left-0 right-0 h-px bg-accent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-200 origin-left" />
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10L10 2M10 2H5M10 2V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              {project.githubUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      project.githubUrl!,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="text-sm font-semibold text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5 cursor-pointer group/btn"
                >
                  <span className="relative">
                    GitHub
                    <span className="absolute -bottom-px left-0 right-0 h-px bg-foreground scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-200 origin-left" />
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10L10 2M10 2H5M10 2V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
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
