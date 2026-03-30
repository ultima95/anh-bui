import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { experience } from "@/src/lib/schema";

export async function GET() {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(experience).where(eq(experience.siteId, siteId)).orderBy(asc(experience.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();
  const { company, position, startDate, endDate, description, location, displayOrder } = body;
  if (!company || !position || !startDate || !description) {
    return NextResponse.json({ error: "company, position, startDate, and description are required" }, { status: 400 });
  }
  const rows = await db.insert(experience).values({
    siteId, company, position, startDate,
    endDate: endDate || null,
    description,
    location: location || null,
    displayOrder: displayOrder ?? 0,
  }).returning();
  return NextResponse.json(rows[0]);
}
