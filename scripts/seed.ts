/**
 * seed.ts — inserts representative development data into all content tables.
 * Idempotent: deletes existing rows for the active SITE_ID before reinserting.
 *
 * Usage: SITE_ID=anh npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import {
  hero,
  about,
  contact,
  projects,
  skills,
  experience,
} from "../src/lib/schema";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("[seed] ERROR: DATABASE_URL is not set");
    process.exit(1);
  }

  const siteId = process.env.SITE_ID;
  if (!siteId) {
    console.error("[seed] ERROR: SITE_ID is not set. Example: SITE_ID=anh npm run db:seed");
    process.exit(1);
  }

  console.log(`[seed] Seeding site_id="${siteId}"...`);

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  // Delete only this site's rows — safe when multiple sites share the DB
  console.log("[seed] Clearing existing data for this site...");
  await db.delete(experience).where(eq(experience.siteId, siteId));
  await db.delete(skills).where(eq(skills.siteId, siteId));
  await db.delete(projects).where(eq(projects.siteId, siteId));
  await db.delete(contact).where(eq(contact.siteId, siteId));
  await db.delete(about).where(eq(about.siteId, siteId));
  await db.delete(hero).where(eq(hero.siteId, siteId));

  console.log("[seed] Inserting hero...");
  await db.insert(hero).values({
    siteId,
    name: "Anh Bui",
    tagline: "Frontend Developer",
    description:
      "I build accessible, performant web interfaces with a sharp eye for design. Currently seeking junior frontend roles.",
    ctaText: "View My Work",
    ctaUrl: "#projects",
    resumeUrl: "/resume.pdf",
  });

  console.log("[seed] Inserting about...");
  await db.insert(about).values({
    siteId,
    bio: "I'm a frontend developer with a passion for crafting clean, user-focused interfaces. I enjoy working at the intersection of design and engineering — turning thoughtful designs into polished, accessible web experiences.\n\nWhen I'm not coding, I'm exploring design systems, contributing to open-source projects, or learning new tools in the JavaScript ecosystem.",
    avatarUrl: null,
  });

  console.log("[seed] Inserting contact...");
  await db.insert(contact).values({
    siteId,
    email: "anh@example.com",
    githubUrl: "https://github.com/anhbui",
    linkedinUrl: "https://linkedin.com/in/anhbui",
    twitterUrl: null,
  });

  console.log("[seed] Inserting projects...");
  await db.insert(projects).values([
    {
      siteId,
      title: "Portfolio Site",
      slug: "portfolio-site",
      description:
        "A self-hosted portfolio with a built-in admin panel for managing content. Built with Next.js 15, Drizzle ORM, and PostgreSQL. Deployed via Docker Compose on a VPS.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker"],
      imageUrl: null,
      demoUrl: "https://anhbui.dev",
      githubUrl: "https://github.com/anhbui/portfolio",
      featured: true,
      displayOrder: 1,
    },
    {
      siteId,
      title: "Task Manager App",
      slug: "task-manager-app",
      description:
        "A drag-and-drop task management app with real-time updates. Supports boards, lists, and cards with keyboard navigation and full accessibility.",
      techStack: ["React", "TypeScript", "Vite", "Zustand"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/anhbui/taskmanager",
      featured: true,
      displayOrder: 2,
    },
    {
      siteId,
      title: "Weather Dashboard",
      slug: "weather-dashboard",
      description:
        "A responsive weather dashboard that fetches forecasts from the OpenWeather API. Includes location search, 7-day forecast, and chart visualisations.",
      techStack: ["React", "Recharts", "OpenWeather API"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/anhbui/weather",
      featured: false,
      displayOrder: 3,
    },
  ]);

  console.log("[seed] Inserting skills...");
  await db.insert(skills).values([
    { siteId, name: "React", category: "Frontend", proficiencyLevel: 5, displayOrder: 1 },
    { siteId, name: "TypeScript", category: "Frontend", proficiencyLevel: 4, displayOrder: 2 },
    { siteId, name: "Next.js", category: "Frontend", proficiencyLevel: 4, displayOrder: 3 },
    { siteId, name: "Tailwind CSS", category: "Frontend", proficiencyLevel: 5, displayOrder: 4 },
    { siteId, name: "HTML & CSS", category: "Frontend", proficiencyLevel: 5, displayOrder: 5 },
    { siteId, name: "Node.js", category: "Backend", proficiencyLevel: 3, displayOrder: 6 },
    { siteId, name: "PostgreSQL", category: "Backend", proficiencyLevel: 3, displayOrder: 7 },
    { siteId, name: "Git", category: "Tools", proficiencyLevel: 4, displayOrder: 8 },
    { siteId, name: "Docker", category: "Tools", proficiencyLevel: 3, displayOrder: 9 },
    { siteId, name: "Figma", category: "Tools", proficiencyLevel: 3, displayOrder: 10 },
  ]);

  console.log("[seed] Inserting experience...");
  await db.insert(experience).values([
    {
      siteId,
      company: "Freelance",
      position: "Frontend Developer",
      startDate: "Mar 2024",
      endDate: null,
      description:
        "Building responsive web interfaces for small businesses and startups. Projects include e-commerce storefronts, landing pages, and internal dashboards.",
      location: "Remote",
      displayOrder: 1,
    },
    {
      siteId,
      company: "Tech Internship Co.",
      position: "Frontend Intern",
      startDate: "Jun 2023",
      endDate: "Dec 2023",
      description:
        "Contributed to a React component library used across three internal products. Improved accessibility scores (WCAG AA) on the main dashboard, reducing keyboard navigation issues by 80%.",
      location: "Ho Chi Minh City, VN",
      displayOrder: 2,
    },
  ]);

  console.log(`[seed] Done. All tables populated for site_id="${siteId}".`);
  await pool.end();
}

main().catch((err) => {
  console.error("[seed] Seed failed:", err);
  process.exit(1);
});
