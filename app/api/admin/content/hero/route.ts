import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { hero } from "@/src/lib/schema";

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();

  const { name, tagline, description, ctaText, ctaUrl, resumeUrl } = body;
  if (!name || !tagline || !description) {
    return NextResponse.json({ error: "name, tagline, and description are required" }, { status: 400 });
  }

  await db
    .update(hero)
    .set({ name, tagline, description, ctaText, ctaUrl, resumeUrl: resumeUrl || null })
    .where(eq(hero.siteId, siteId));

  return NextResponse.json({ ok: true });
}
