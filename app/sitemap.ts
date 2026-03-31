// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/src/lib/db";
import { projects } from "@/src/lib/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const siteId = process.env.SITE_ID;

  const projectEntries: MetadataRoute.Sitemap = [];

  if (siteId) {
    try {
      const projectRows = await db
        .select({ slug: projects.slug })
        .from(projects)
        .where(eq(projects.siteId, siteId))
        .orderBy(asc(projects.displayOrder));

      for (const { slug } of projectRows) {
        projectEntries.push({
          url: `${siteUrl}/projects/${slug}`,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    } catch {
      // DB unavailable — return homepage only
    }
  }

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...projectEntries,
  ];
}
