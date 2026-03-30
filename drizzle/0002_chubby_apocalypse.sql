CREATE TABLE "admin_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_credentials_site_id_unique" UNIQUE("site_id")
);
