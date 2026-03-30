import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getSession } from "@/src/lib/session";

export async function POST(req: NextRequest) {
  // Guard: ADMIN_PASSWORD must be set
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("[admin/login] ADMIN_PASSWORD env var is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { password } = body;

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // Timing-safe comparison — prevents timing-based enumeration
  let isMatch = false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(adminPassword);
    // timingSafeEqual requires equal-length buffers
    if (a.length === b.length) {
      isMatch = timingSafeEqual(a, b);
    }
  } catch {
    isMatch = false;
  }

  if (!isMatch) {
    console.error(
      `[admin/login] Failed login attempt at ${new Date().toISOString()}`
    );
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  console.log(`[admin/login] Successful login at ${new Date().toISOString()}`);
  return NextResponse.json({ ok: true });
}
