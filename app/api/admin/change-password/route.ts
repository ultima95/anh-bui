import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";
import { adminCredentials } from "@/src/lib/schema";
import { requireAuth } from "@/src/lib/auth";

export async function POST(req: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const siteId = process.env.SITE_ID!;
  let body: { currentPassword: string; newPassword: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both fields are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const [row] = await db
    .select({ id: adminCredentials.id, passwordHash: adminCredentials.passwordHash })
    .from(adminCredentials)
    .where(eq(adminCredentials.siteId, siteId))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "No admin account found." }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, row.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .update(adminCredentials)
    .set({ passwordHash: hash, updatedAt: new Date() })
    .where(eq(adminCredentials.id, row.id));

  console.log(`[admin] Password changed for site ${siteId} at ${new Date().toISOString()}`);
  return NextResponse.json({ ok: true });
}
