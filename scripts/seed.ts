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
    name: "Bui Ngoc Anh",
    tagline: "Front End Developer",
    description:
      "Motivated Software Engineer passionate about web development. Looking for opportunities to apply my skills in React, Next.js, and modern web technologies while continuously learning and contributing to impactful products.",
    ctaText: "View My Work",
    ctaUrl: "#projects",
    resumeUrl: "/resume.pdf",
  });

  console.log("[seed] Inserting about...");
  await db.insert(about).values({
    siteId,
    bio: "I'm a Front End Developer based in Thu Duc City, Ho Chi Minh City, with a degree in Software Engineering from Ho Chi Minh City University of Technology and Education (HCMUTE, 2020–2024).\n\nI specialise in building responsive, scalable user interfaces with React, Next.js, and TypeScript. I'm experienced with state management (Redux Toolkit, React Query), API integration (RESTful, GraphQL), and modern styling tools (Tailwind CSS v4, Ant Design, Shadcn/UI). I also leverage AI-assisted development tools like Cursor AI and GitHub Copilot to ship faster and smarter.",
    avatarUrl: null,
  });

  console.log("[seed] Inserting contact...");
  await db.insert(contact).values({
    siteId,
    email: "anhngocbui332@gmail.com",
    githubUrl: "https://github.com/anhbui",
    linkedinUrl: "https://linkedin.com/in/anhbui",
    twitterUrl: null,
  });

  console.log("[seed] Inserting projects...");
  await db.insert(projects).values([
    {
      siteId,
      title: "Family Circle",
      slug: "family-circle",
      description:
        "A community website for sharing parenting knowledge for parents with children aged 0 to 6. Built with real-time chat via WebSocket and a push notification system. Responsible for UI design, performance optimisation, API integration, and deployment.",
      techStack: ["ReactJS", "JavaScript", "Tailwind CSS", "Ant Design", "Tanstack Query", "Redux", "WebSocket"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      displayOrder: 1,
    },
    {
      siteId,
      title: "Look That People",
      slug: "look-that-people",
      description:
        "A community platform to explore shared aspects and unique distinctions among individuals, inspired by Tech JDI with a blend of art and aesthetics. Developed responsive layouts for all devices and integrated RESTful APIs and GraphQL endpoints.",
      techStack: ["ReactJS", "Tailwind CSS", "Ant Design", "Node.js", "Express.js", "GraphQL"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: true,
      displayOrder: 2,
    },
    {
      siteId,
      title: "MCB",
      slug: "mcb",
      description:
        "A website introducing MCB and providing opportunities to participate in exclusive Mega RWA and DePIN projects. Developed and maintained the UI with NextJS, ensuring smooth cross-device experience and stable data flow via RESTful APIs and GraphQL.",
      techStack: ["NextJS", "Tailwind CSS", "Ant Design", "Node.js", "Express.js", "GraphQL"],
      imageUrl: null,
      demoUrl: null,
      githubUrl: null,
      featured: false,
      displayOrder: 3,
    },
  ]);

  console.log("[seed] Inserting skills...");
  await db.insert(skills).values([
    // Frontend
    { siteId, name: "HTML & CSS", category: "Frontend", proficiencyLevel: 5, displayOrder: 1 },
    { siteId, name: "JavaScript (ES6+)", category: "Frontend", proficiencyLevel: 5, displayOrder: 2 },
    { siteId, name: "TypeScript", category: "Frontend", proficiencyLevel: 4, displayOrder: 3 },
    { siteId, name: "React.js", category: "Frontend", proficiencyLevel: 5, displayOrder: 4 },
    { siteId, name: "Next.js", category: "Frontend", proficiencyLevel: 5, displayOrder: 5 },
    // State Management & API
    { siteId, name: "React Query", category: "State Management & API", proficiencyLevel: 4, displayOrder: 6 },
    { siteId, name: "Redux Toolkit", category: "State Management & API", proficiencyLevel: 4, displayOrder: 7 },
    { siteId, name: "RESTful APIs", category: "State Management & API", proficiencyLevel: 5, displayOrder: 8 },
    { siteId, name: "GraphQL", category: "State Management & API", proficiencyLevel: 4, displayOrder: 9 },
    // Styling & UI
    { siteId, name: "Tailwind CSS", category: "Styling & UI", proficiencyLevel: 5, displayOrder: 10 },
    { siteId, name: "Ant Design", category: "Styling & UI", proficiencyLevel: 4, displayOrder: 11 },
    { siteId, name: "Shadcn/UI", category: "Styling & UI", proficiencyLevel: 4, displayOrder: 12 },
    // Testing
    { siteId, name: "Vitest", category: "Testing", proficiencyLevel: 3, displayOrder: 13 },
    { siteId, name: "React Testing Library", category: "Testing", proficiencyLevel: 3, displayOrder: 14 },
    // Design Tools
    { siteId, name: "Figma", category: "Design Tools", proficiencyLevel: 4, displayOrder: 15 },
    { siteId, name: "Adobe Illustrator", category: "Design Tools", proficiencyLevel: 3, displayOrder: 16 },
    { siteId, name: "Adobe Photoshop", category: "Design Tools", proficiencyLevel: 3, displayOrder: 17 },
    // Tools
    { siteId, name: "Git", category: "Tools", proficiencyLevel: 4, displayOrder: 18 },
    { siteId, name: "Node.js", category: "Tools", proficiencyLevel: 3, displayOrder: 19 },
    { siteId, name: "Express.js", category: "Tools", proficiencyLevel: 3, displayOrder: 20 },
    { siteId, name: "Golang", category: "Tools", proficiencyLevel: 2, displayOrder: 21 },
    { siteId, name: "Cursor AI / Copilot", category: "Tools", proficiencyLevel: 4, displayOrder: 22 },
  ]);

  console.log("[seed] Inserting experience...");
  await db.insert(experience).values([
    {
      siteId,
      company: "GTG CRM",
      position: "Front End Developer",
      startDate: "May 2025",
      endDate: null,
      description:
        "Developed responsive CRM applications and landing pages using React and Next.js, building scalable, reusable component architecture from Figma designs. Integrated RESTful APIs with optimized data-fetching strategies (SSR, SSG, client-side) for dynamic, high-performance user experiences. Implemented real-time features using WebSocket for live chat and messaging. Optimized performance through code-splitting, lazy loading, and caching to ensure cross-device compatibility.\nTech Stack: React, Next.js, TypeScript, Tailwind CSS, WebSocket, REST APIs",
      location: "Ho Chi Minh City, Vietnam",
      displayOrder: 1,
    },
    {
      siteId,
      company: "TECH JDI",
      position: "Front End Developer",
      startDate: "Feb 2024",
      endDate: "Apr 2025",
      description:
        "Built responsive web applications using React and Next.js, focusing on scalable and reusable component architecture. Integrated RESTful APIs and GraphQL to ensure efficient data flow between frontend and backend services. Collaborated closely with backend developers and supported server-side development using Node.js and Express.js.\nTech Stack: React, Next.js, Node.js, Express.js, GraphQL, REST APIs",
      location: "Ho Chi Minh City, Vietnam",
      displayOrder: 2,
    },
    {
      siteId,
      company: "TMA Solutions",
      position: "Front End Developer",
      startDate: "Jun 2023",
      endDate: "Sep 2023",
      description:
        "Developed user interfaces for a library management web application using React and Firebase. Implemented responsive design and optimized frontend performance for improved user experience across devices. Worked in an Agile development environment, collaborating with team members to deliver features efficiently.\nTech Stack: React, Firebase, JavaScript",
      location: "Ho Chi Minh City, Vietnam",
      displayOrder: 3,
    },
  ]);

  console.log(`[seed] Done. All tables populated for site_id="${siteId}".`);
  await pool.end();
}

main().catch((err) => {
  console.error("[seed] Seed failed:", err);
  process.exit(1);
});
