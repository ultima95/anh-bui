import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, and } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { experience } from "@/src/lib/schema";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;
  const body = await req.json();
  const { company, position, startDate, endDate, description, location, displayOrder } = body;

  await db.update(experience).set({
    company, position, startDate,
    endDate: endDate || null,
    description,
    location: location || null,
    displayOrder,
  }).where(and(eq(experience.id, Number(id)), eq(experience.siteId, siteId)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const { id } = await params;
  await db.delete(experience).where(and(eq(experience.id, Number(id)), eq(experience.siteId, siteId)));
  return NextResponse.json({ ok: true });
}
