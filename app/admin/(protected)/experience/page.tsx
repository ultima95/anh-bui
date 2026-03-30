import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { experience } from "@/src/lib/schema";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(experience).where(eq(experience.siteId, siteId)).orderBy(asc(experience.displayOrder));

  return (
    <>
      <div className="mb-8">
        <a href="/admin" className="text-xs text-muted hover:text-foreground transition-colors">← Dashboard</a>
        <h1 className="text-xl font-semibold text-foreground mt-2">Experience</h1>
      </div>
      <ExperienceManager initial={rows} />
    </>
  );
}
