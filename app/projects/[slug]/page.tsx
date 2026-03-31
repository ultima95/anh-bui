import { db } from "@/src/lib/db";
import { projects } from "@/src/lib/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildMetadata, getBaseUrl } from "@/src/lib/seo";

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026");
}

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteId = process.env.SITE_ID;
  if (!siteId) return {};
  try {
    const [project] = await db
      .select({ title: projects.title, description: projects.description })
      .from(projects)
      .where(and(eq(projects.siteId, siteId), eq(projects.slug, slug)))
      .limit(1);
    if (!project) return {};
    return buildMetadata({
      title: project.title,
      description: project.description,
      path: `/projects/${slug}`,
    });
  } catch {
    return {};
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const siteId = process.env.SITE_ID;

  if (!siteId) {
    throw new Error("SITE_ID env var is required.");
  }

  const [headersList, [project]] = await Promise.all([
    headers(),
    db
      .select()
      .from(projects)
      .where(and(eq(projects.siteId, siteId), eq(projects.slug, slug)))
      .limit(1),
  ]);

  if (!project) {
    notFound();
  }

  const baseUrl = getBaseUrl(headersList);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${slug}`,
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }}
      />
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors mb-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All projects
        </Link>

        {/* Image */}
        {project.imageUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-surface mb-10 ring-1 ring-black/[0.07]">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={900}
              height={506}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Title */}
        <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-foreground leading-tight mb-5">
          {project.title}
        </h1>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-semibold text-foreground/50 bg-black/[0.04] px-2.5 py-1 rounded-md tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-base text-muted leading-relaxed mb-10">
          {project.description}
        </p>

        {/* Links */}
        {(project.demoUrl || project.githubUrl) && (
          <div className="flex items-center gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors"
              >
                Live demo
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-black/10 text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-black/[0.04] transition-colors"
              >
                GitHub
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
