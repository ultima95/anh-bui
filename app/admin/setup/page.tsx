export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { adminCredentials } from "@/src/lib/schema";
import SetupForm from "./SetupForm";

export default async function SetupPage() {
  const siteId = process.env.SITE_ID;
  if (!siteId) throw new Error("SITE_ID env var is not set.");

  // If a credential already exists, this page is no longer needed
  const existing = await db
    .select({ id: adminCredentials.id })
    .from(adminCredentials)
    .where(eq(adminCredentials.siteId, siteId))
    .limit(1);

  if (existing.length > 0) {
    redirect("/admin/login");
  }

  return <SetupForm />;
}
