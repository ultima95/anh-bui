CREATE TABLE "about" (
	"id" serial PRIMARY KEY NOT NULL,
	"bio" text NOT NULL,
	"avatar_url" text
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"github_url" text,
	"linkedin_url" text,
	"twitter_url" text
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text NOT NULL,
	"location" text,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"cta_text" text DEFAULT 'View My Work' NOT NULL,
	"cta_url" text DEFAULT '#projects' NOT NULL,
	"resume_url" text
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"image_url" text,
	"demo_url" text,
	"github_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"proficiency_level" integer DEFAULT 3 NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
