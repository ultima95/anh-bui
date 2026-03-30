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
  const rows = await db.insert(projects).values({
    siteId, title, description,
    techStack: Array.isArray(techStack) ? techStack : [],
    imageUrl: imageUrl || null,
    demoUrl: demoUrl || null,
    githubUrl: githubUrl || null,
    featured: Boolean(featured),
    displayOrder: displayOrder ?? 0,
  }).returning();
  return NextResponse.json(rows[0]);
}
