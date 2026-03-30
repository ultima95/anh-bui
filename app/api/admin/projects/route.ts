import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { projects } from "@/src/lib/schema";

export async function GET() {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(projects).where(eq(projects.siteId, siteId)).orderBy(asc(projects.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();
  const { title, description, techStack, imageUrl, demoUrl, githubUrl, featured, displayOrder } = body;
  if (!title || !description) {
    return NextResponse.json({ error: "title and description are required" }, { status: 400 });
  }
  // Derive slug from title if not explicitly supplied (matches migration backfill logic)
  const slug: string = body.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const rows = await db.insert(projects).values({
    siteId, title, slug, description,
    techStack: Array.isArray(techStack) ? techStack : [],
    imageUrl: imageUrl || null,
    demoUrl: demoUrl || null,
    githubUrl: githubUrl || null,
    featured: Boolean(featured),
    displayOrder: displayOrder ?? 0,
  }).returning();
  return NextResponse.json(rows[0]);
}
