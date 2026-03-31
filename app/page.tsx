import { db } from "@/src/lib/db";
import {
  hero,
  about,
  projects,
  skills,
  experience,
  contact,
} from "@/src/lib/schema";
import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Hero from "@/app/components/sections/Hero";
import About from "@/app/components/sections/About";
import Projects from "@/app/components/sections/Projects";
import Skills from "@/app/components/sections/Skills";
import Experience from "@/app/components/sections/Experience";
import Contact from "@/app/components/sections/Contact";
import type {
  HeroRow,
  AboutRow,
  ProjectRow,
  SkillRow,
  ExperienceRow,
  ContactRow,
} from "@/app/types";
import { headers } from "next/headers";
import { buildMetadata, getBaseUrl } from "@/src/lib/seo";

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026");
}

// Always fetch fresh content from DB — admin edits must reflect without rebuild
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteId = process.env.SITE_ID;
  if (!siteId) return {};
  try {
    const [heroData] = await db
      .select({ name: hero.name, tagline: hero.tagline, description: hero.description })
      .from(hero)
      .where(eq(hero.siteId, siteId))
      .limit(1);
    if (!heroData) return {};
    const title = `${heroData.name} — ${heroData.tagline}`;
    return buildMetadata({ title, description: heroData.description, path: "/" });
  } catch {
    return {};
  }
}

async function getData() {
  const siteId = process.env.SITE_ID;
  if (!siteId) {
    throw new Error(
      "SITE_ID env var is required. Set it to your site's identifier (e.g. SITE_ID=anh)."
    );
  }

  try {
    const [heroData, aboutData, projectsData, skillsData, expData, contactData] =
      await Promise.all([
        db.select().from(hero).where(eq(hero.siteId, siteId)).limit(1),
        db.select().from(about).where(eq(about.siteId, siteId)).limit(1),
        db.select().from(projects).where(eq(projects.siteId, siteId)).orderBy(asc(projects.displayOrder)),
        db.select().from(skills).where(eq(skills.siteId, siteId)).orderBy(asc(skills.displayOrder)),
        db.select().from(experience).where(eq(experience.siteId, siteId)).orderBy(asc(experience.displayOrder)),
        db.select().from(contact).where(eq(contact.siteId, siteId)).limit(1),
      ]);

    return {
      hero: heroData[0] ?? null,
      about: aboutData[0] ?? null,
      projects: projectsData,
      skills: skillsData,
      experience: expData,
      contact: contactData[0] ?? null,
      error: null,
    };
  } catch {
    return {
      hero: null,
      about: null,
      projects: [] as ProjectRow[],
      skills: [] as SkillRow[],
      experience: [] as ExperienceRow[],
      contact: null,
      error: "Database unavailable",
    };
  }
}

export default async function Page() {
  const [headersList, data] = await Promise.all([headers(), getData()]);
  const baseUrl = getBaseUrl(headersList);

  if (data.error && process.env.NODE_ENV === "development") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-sm font-mono text-muted mb-2">dev notice</p>
          <p className="text-foreground font-medium mb-4">Database not reachable</p>
          <p className="text-sm text-muted">
            Start postgres:{" "}
            <code className="font-mono text-xs bg-surface px-2 py-1 rounded">
              docker compose --env-file .env.local up postgres -d
            </code>
          </p>
          <p className="text-sm text-muted mt-2">
            Then run:{" "}
            <code className="font-mono text-xs bg-surface px-2 py-1 rounded">
              npx tsx scripts/migrate.ts && npx tsx scripts/seed.ts
            </code>
          </p>
        </div>
      </div>
    );
  }

  // Build sameAs only from http/https contact links (email/mailto excluded)
  const sameAs = [
    data.contact?.githubUrl,
    data.contact?.linkedinUrl,
    data.contact?.twitterUrl,
  ].filter((url): url is string => typeof url === "string" && url.startsWith("http"));

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.hero?.name ?? "Anh Bui",
    url: baseUrl,
    description: data.hero?.description ?? "",
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.hero?.name ?? "Anh Bui",
    jobTitle: data.hero?.tagline ?? "",
    url: baseUrl,
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <Header />
      <main>
        <Hero data={data.hero} />
        <About data={data.about} />
        <Projects data={data.projects} />
        <Skills data={data.skills} />
        <Experience data={data.experience} />
        <Contact data={data.contact} />
      </main>
    </>
  );
}
