"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { ProjectRow } from "@/app/types";

export default function Projects({ data }: { data: ProjectRow[] }) {
  if (data.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="py-28 border-t border-black/[0.06]">
      {/* Header row */}
      <div className="px-6 max-w-5xl mx-auto mb-10">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs font-bold text-accent tracking-wider">02</span>
              <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
              <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">Projects</h2>
            </div>

            {/* Arrow controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll projects left"
                className="w-8 h-8 flex items-center justify-center rounded-full ring-1 ring-black/[0.08] bg-white hover:bg-accent hover:ring-accent hover:text-white text-muted transition-all duration-200 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll projects right"
                className="w-8 h-8 flex items-center justify-center rounded-full ring-1 ring-black/[0.08] bg-white hover:bg-accent hover:ring-accent hover:text-white text-muted transition-all duration-200 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Scroll strip */}
      <div className="relative max-w-5xl mx-auto overflow-hidden">
        {/* Right fade — hints at more content */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10"
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          role="list"
          aria-label="Projects"
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pl-6 pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((project) => (
            <ProjectScrollCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectScrollCard({ project }: { project: ProjectRow }) {
  const isFeatured = project.featured;

  return (
    <Link
      href={`/projects/${project.slug}`}
      role="listitem"
      aria-label={`View ${project.title} project`}
      className={[
        "block group flex-shrink-0 snap-start",
        isFeatured ? "w-[440px]" : "w-[300px]",
      ].join(" ")}
    >
      <article className="flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.07] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 will-change-transform h-[320px]">

        {/* Image */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ height: isFeatured ? 180 : 155 }}
        >
          {project.imageUrl ? (
            <>
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes={isFeatured ? "440px" : "300px"}
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50/60">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="3" y="6" width="26" height="20" rx="3" stroke="#D4B896" strokeWidth="1.5" />
                <circle cx="10.5" cy="13" r="2.5" fill="#D4B896" />
                <path d="M3 21l7-5 5 5 5-7 7 7" stroke="#D4B896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {isFeatured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase text-accent border border-accent/25 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-accent/70 flex-shrink-0" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2 min-h-0 overflow-hidden">
          <h3
            className={[
              "font-display font-semibold text-foreground leading-snug group-hover:text-accent transition-colors duration-200",
              isFeatured ? "text-[0.95rem]" : "text-[0.875rem]",
            ].join(" ")}
          >
            {project.title}
          </h3>

          <p className="text-[0.775rem] text-muted leading-relaxed line-clamp-2 flex-1">
            {project.description}
          </p>

          <div className="flex items-center justify-between gap-2 mt-auto pt-2.5 border-t border-black/[0.04]">
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 min-w-0">
                {project.techStack.slice(0, isFeatured ? 4 : 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-semibold text-foreground/45 bg-black/[0.04] px-1.5 py-0.5 rounded tracking-wide whitespace-nowrap"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
              {project.demoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.demoUrl!, "_blank", "noopener,noreferrer");
                  }}
                  className="text-[10px] font-semibold text-foreground hover:text-accent transition-colors inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Demo
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M1.5 7.5L7.5 1.5M7.5 1.5H4M7.5 1.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                  className="text-[10px] font-semibold text-muted hover:text-foreground transition-colors inline-flex items-center gap-0.5 cursor-pointer"
                >
                  GitHub
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M1.5 7.5L7.5 1.5M7.5 1.5H4M7.5 1.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
