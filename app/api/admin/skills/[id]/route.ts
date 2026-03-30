import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, and } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { skills } from "@/src/lib/schema";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;
  const body = await req.json();
  const { name, category, proficiencyLevel, displayOrder } = body;

  await db.update(skills).set({ name, category, proficiencyLevel, displayOrder })
    .where(and(eq(skills.id, Number(id)), eq(skills.siteId, siteId)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;

  await db.delete(skills).where(and(eq(skills.id, Number(id)), eq(skills.siteId, siteId)));
  return NextResponse.json({ ok: true });
}
