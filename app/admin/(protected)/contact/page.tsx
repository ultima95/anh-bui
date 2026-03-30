import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { contact } from "@/src/lib/schema";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const siteId = process.env.SITE_ID!;
  const rows = await db.select().from(contact).where(eq(contact.siteId, siteId)).limit(1);
  const row = rows[0];

  return (
    <>
      <div className="mb-8">
        <a href="/admin" className="text-xs text-muted hover:text-foreground transition-colors">← Dashboard</a>
        <h1 className="text-xl font-semibold text-foreground mt-2">Contact</h1>
      </div>
      <section className="bg-white border border-black/[0.08] rounded-xl p-6 max-w-lg">
        {row ? (
          <ContactForm initial={{ email: row.email, githubUrl: row.githubUrl, linkedinUrl: row.linkedinUrl, twitterUrl: row.twitterUrl }} />
        ) : (
          <p className="text-sm text-muted">No contact data found. Run the seed script.</p>
        )}
      </section>
    </>
  );
}
