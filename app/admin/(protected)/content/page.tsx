import { eq } from "drizzle-orm";
import { db } from "@/src/lib/db";
import { hero, about } from "@/src/lib/schema";
import { HeroForm, AboutForm } from "./ContentForms";

export default async function ContentPage() {
  const siteId = process.env.SITE_ID!;

  const [heroRow, aboutRow] = await Promise.all([
    db.select().from(hero).where(eq(hero.siteId, siteId)).limit(1),
    db.select().from(about).where(eq(about.siteId, siteId)).limit(1),
  ]);

  const h = heroRow[0];
  const a = aboutRow[0];

  return (
    <>
      <div className="mb-8">
        <a href="/admin" className="text-xs text-muted hover:text-foreground transition-colors">
          ← Dashboard
        </a>
        <h1 className="text-xl font-semibold text-foreground mt-2">Hero &amp; About</h1>
      </div>

      <div className="space-y-10">
        <section className="bg-white border border-black/[0.08] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Hero Section</h2>
          {h ? (
            <HeroForm
              initial={{
                name: h.name,
                tagline: h.tagline,
                description: h.description,
                ctaText: h.ctaText,
                ctaUrl: h.ctaUrl,
                resumeUrl: h.resumeUrl,
              }}
            />
          ) : (
            <p className="text-sm text-muted">No hero data found. Run the seed script.</p>
          )}
        </section>

        <section className="bg-white border border-black/[0.08] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">About Section</h2>
          {a ? (
            <AboutForm initial={{ bio: a.bio, avatarUrl: a.avatarUrl }} />
          ) : (
            <p className="text-sm text-muted">No about data found. Run the seed script.</p>
          )}
        </section>
      </div>
    </>
  );
}
