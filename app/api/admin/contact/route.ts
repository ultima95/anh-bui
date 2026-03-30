import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { contact } from "@/src/lib/schema";

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth(); if (unauth) return unauth;
  const siteId = process.env.SITE_ID!;
  const body = await req.json();

  const { email, githubUrl, linkedinUrl, twitterUrl } = body;
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  await db
    .update(contact)
    .set({
      email,
      githubUrl: githubUrl || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
    })
    .where(eq(contact.siteId, siteId));

  return NextResponse.json({ ok: true });
}
