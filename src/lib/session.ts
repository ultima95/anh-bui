import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "admin-session",
  cookieOptions: {
    // Only use secure cookies in production (HTTPS)
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

/**
 * Returns the iron-session for the current request.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
