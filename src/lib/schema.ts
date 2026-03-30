import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Admin credentials — one row per site, stores bcrypt hash.
// Created via /admin/setup on first deploy.
// ---------------------------------------------------------------------------

export const adminCredentials = pgTable("admin_credentials", {
  id: serial("id").primaryKey(),
  siteId: text("site_id").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Single-row tables (hero, about, contact) — one row per site.
// Enforced by unique constraint on site_id.
// ---------------------------------------------------------------------------

export const hero = pgTable(
  "hero",
  {
    id: serial("id").primaryKey(),
    siteId: text("site_id").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    ctaText: text("cta_text").notNull().default("View My Work"),
    ctaUrl: text("cta_url").notNull().default("#projects"),
    resumeUrl: text("resume_url"),
  },
  (t) => [unique("hero_site_id_unique").on(t.siteId)]
);

export const about = pgTable(
  "about",
  {
    id: serial("id").primaryKey(),
    siteId: text("site_id").notNull(),
    bio: text("bio").notNull(),
    avatarUrl: text("avatar_url"),
  },
  (t) => [unique("about_site_id_unique").on(t.siteId)]
);

export const contact = pgTable(
  "contact",
  {
    id: serial("id").primaryKey(),
    siteId: text("site_id").notNull(),
    email: text("email").notNull(),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),
    twitterUrl: text("twitter_url"),
  },
  (t) => [unique("contact_site_id_unique").on(t.siteId)]
);

// ---------------------------------------------------------------------------
// Multi-row content tables — rows are scoped by site_id
// ---------------------------------------------------------------------------

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  siteId: text("site_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull().default([]),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  featured: boolean("featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  siteId: text("site_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g. "Frontend", "Tools", "Backend"
  proficiencyLevel: integer("proficiency_level").notNull().default(3), // 1-5
  displayOrder: integer("display_order").notNull().default(0),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  siteId: text("site_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: text("start_date").notNull(), // "Jan 2023" — human-readable
  endDate: text("end_date"), // null = present
  description: text("description").notNull(),
  location: text("location"),
  displayOrder: integer("display_order").notNull().default(0),
});
