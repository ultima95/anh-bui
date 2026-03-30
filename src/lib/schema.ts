import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Single-row tables (hero, about, contact) — id=1 enforced by application
// ---------------------------------------------------------------------------

export const hero = pgTable("hero", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  ctaText: text("cta_text").notNull().default("View My Work"),
  ctaUrl: text("cta_url").notNull().default("#projects"),
  resumeUrl: text("resume_url"),
});

export const about = pgTable("about", {
  id: serial("id").primaryKey(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
});

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
});

// ---------------------------------------------------------------------------
// Multi-row content tables
// ---------------------------------------------------------------------------

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
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
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g. "Frontend", "Tools", "Backend"
  proficiencyLevel: integer("proficiency_level").notNull().default(3), // 1-5
  displayOrder: integer("display_order").notNull().default(0),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: text("start_date").notNull(), // "Jan 2023" — human-readable
  endDate: text("end_date"), // null = present
  description: text("description").notNull(),
  location: text("location"),
  displayOrder: integer("display_order").notNull().default(0),
});
