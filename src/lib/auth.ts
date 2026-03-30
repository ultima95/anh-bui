import { NextResponse } from "next/server";
import { getSession } from "./session";

/**
 * Returns null if the request is authenticated, or a 401 NextResponse if not.
 * Usage: const unauth = await requireAuth(); if (unauth) return unauth;
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
