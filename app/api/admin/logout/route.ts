import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
