import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, and } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { projects } from "@/src/lib/schema";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;
  const body = await req.json();
  const { title, description, techStack, imageUrl, demoUrl, githubUrl, featured, displayOrder } = body;
  // Accept explicit slug; if omitted, derive from title
  const slug: string | undefined = body.slug?.trim() || undefined;

  await db.update(projects).set({
    title, description,
    ...(slug !== undefined ? { slug } : {}),
    techStack: Array.isArray(techStack) ? techStack : [],
    imageUrl: imageUrl || null,
    demoUrl: demoUrl || null,
    githubUrl: githubUrl || null,
    featured: Boolean(featured),
    displayOrder,
  }).where(and(eq(projects.id, Number(id)), eq(projects.siteId, siteId)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;
  await db.delete(projects).where(and(eq(projects.id, Number(id)), eq(projects.siteId, siteId)));
  return NextResponse.json({ ok: true });
}
