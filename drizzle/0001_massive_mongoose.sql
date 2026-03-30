-- Add site_id with a temporary default so existing rows are not rejected.
-- The seed script (npm run db:seed) will clear these rows and re-insert
-- with the correct SITE_ID. After migration, the default is dropped so
-- all future inserts must supply site_id explicitly.

ALTER TABLE "about" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "about" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "contact" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "experience" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "experience" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "hero" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "hero" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "projects" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "site_id" text NOT NULL DEFAULT '';
ALTER TABLE "skills" ALTER COLUMN "site_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "about" ADD CONSTRAINT "about_site_id_unique" UNIQUE("site_id");
--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_site_id_unique" UNIQUE("site_id");
--> statement-breakpoint
ALTER TABLE "hero" ADD CONSTRAINT "hero_site_id_unique" UNIQUE("site_id");
