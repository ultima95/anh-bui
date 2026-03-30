import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { adminCredentials } from "@/src/lib/schema";
import { getSession } from "@/src/lib/session";

export async function POST(req: NextRequest) {
  const siteId = process.env.SITE_ID;
  if (!siteId) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Block if credential already exists — setup is one-time only
  const existing = await db
    .select({ id: adminCredentials.id })
    .from(adminCredentials)
    .where(eq(adminCredentials.siteId, siteId))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Admin already configured. Use the login page." },
      { status: 403 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { password } = body;
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(adminCredentials).values({ siteId, passwordHash });

  // Log in immediately after setup
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  console.log(`[admin/setup] Admin credential created for site "${siteId}" at ${new Date().toISOString()}`);
  return NextResponse.json({ ok: true });
}
