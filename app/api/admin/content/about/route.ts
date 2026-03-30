import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { about } from "@/src/lib/schema";

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();

  const { bio, avatarUrl } = body;
  if (!bio) {
    return NextResponse.json({ error: "bio is required" }, { status: 400 });
  }

  await db
    .update(about)
    .set({ bio, avatarUrl: avatarUrl || null })
    .where(eq(about.siteId, siteId));

  return NextResponse.json({ ok: true });
}
