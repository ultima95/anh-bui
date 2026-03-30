import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq, asc } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { skills } from "@/src/lib/schema";

export async function GET() {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(skills).where(eq(skills.siteId, siteId)).orderBy(asc(skills.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();
  const { name, category, proficiencyLevel, displayOrder } = body;
  if (!name || !category) {
    return NextResponse.json({ error: "name and category are required" }, { status: 400 });
  }
  const rows = await db.insert(skills).values({
    siteId,
    name,
    category,
    proficiencyLevel: proficiencyLevel ?? 3,
    displayOrder: displayOrder ?? 0,
  }).returning();
  return NextResponse.json(rows[0]);
}
