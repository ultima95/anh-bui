import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { projects } from "@/src/lib/schema";
import { isS3Configured } from "@/src/lib/s3";
import ProjectsManager from "./ProjectsManager";

export default async function ProjectsPage() {
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(projects).where(eq(projects.siteId, siteId)).orderBy(asc(projects.displayOrder));

  return (
    <>
      <div className="mb-8">
        <a href="/admin" className="text-xs text-muted hover:text-foreground transition-colors">← Dashboard</a>
        <h1 className="text-xl font-semibold text-foreground mt-2">Projects</h1>
      </div>
      <ProjectsManager initial={rows} s3Configured={isS3Configured()} />
    </>
  );
}
