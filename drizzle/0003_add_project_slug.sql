ALTER TABLE "projects" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "projects" SET "slug" = lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g')) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_site_id_unique" UNIQUE("site_id","slug");
