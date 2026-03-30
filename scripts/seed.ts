/**
 * seed.ts — inserts representative development data into all content tables.
 * Idempotent: clears existing data before inserting.
 *
 * Usage: npx tsx scripts/seed.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
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

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log("[seed] Clearing existing data...");
  await db.delete(hero);
  await db.delete(about);
  await db.delete(contact);
  await db.delete(projects);
  await db.delete(skills);
  await db.delete(experience);

  console.log("[seed] Inserting hero...");
  await db.insert(hero).values({
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
    bio: "I'm a frontend developer with a passion for crafting clean, user-focused interfaces. I enjoy working at the intersection of design and engineering — turning thoughtful designs into polished, accessible web experiences.\n\nWhen I'm not coding, I'm exploring design systems, contributing to open-source projects, or learning new tools in the JavaScript ecosystem.",
    avatarUrl: null,
  });

  console.log("[seed] Inserting contact...");
  await db.insert(contact).values({
    email: "anh@example.com",
    githubUrl: "https://github.com/anhbui",
    linkedinUrl: "https://linkedin.com/in/anhbui",
    twitterUrl: null,
  });

  console.log("[seed] Inserting projects...");
  await db.insert(projects).values([
    {
      title: "Portfolio Site",
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
      title: "Task Manager App",
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
      title: "Weather Dashboard",
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
    { name: "React", category: "Frontend", proficiencyLevel: 5, displayOrder: 1 },
    { name: "TypeScript", category: "Frontend", proficiencyLevel: 4, displayOrder: 2 },
    { name: "Next.js", category: "Frontend", proficiencyLevel: 4, displayOrder: 3 },
    { name: "Tailwind CSS", category: "Frontend", proficiencyLevel: 5, displayOrder: 4 },
    { name: "HTML & CSS", category: "Frontend", proficiencyLevel: 5, displayOrder: 5 },
    { name: "Node.js", category: "Backend", proficiencyLevel: 3, displayOrder: 6 },
    { name: "PostgreSQL", category: "Backend", proficiencyLevel: 3, displayOrder: 7 },
    { name: "Git", category: "Tools", proficiencyLevel: 4, displayOrder: 8 },
    { name: "Docker", category: "Tools", proficiencyLevel: 3, displayOrder: 9 },
    { name: "Figma", category: "Tools", proficiencyLevel: 3, displayOrder: 10 },
  ]);

  console.log("[seed] Inserting experience...");
  await db.insert(experience).values([
    {
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

  console.log("[seed] Done. All tables populated.");
  await pool.end();
}

main().catch((err) => {
  console.error("[seed] Seed failed:", err);
  process.exit(1);
});
