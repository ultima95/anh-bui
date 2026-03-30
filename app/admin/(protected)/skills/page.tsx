import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { skills } from "@/src/lib/schema";
import SkillsManager from "./SkillsManager";

export default async function SkillsPage() {
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(skills).where(eq(skills.siteId, siteId)).orderBy(asc(skills.displayOrder));

  return (
    <>
      <div className="mb-8">
        <a href="/admin" className="text-xs text-muted hover:text-foreground transition-colors">← Dashboard</a>
        <h1 className="text-xl font-semibold text-foreground mt-2">Skills</h1>
      </div>
      <section className="bg-white border border-black/[0.08] rounded-xl p-6">
        <SkillsManager initial={rows} />
      </section>
    </>
  );
}
