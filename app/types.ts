import type { InferSelectModel } from "drizzle-orm";
import type {
  hero,
  about,
  projects,
  skills,
  experience,
  contact,
} from "@/src/lib/schema";

export type HeroRow = InferSelectModel<typeof hero>;
export type AboutRow = InferSelectModel<typeof about>;
export type ProjectRow = InferSelectModel<typeof projects>;
export type SkillRow = InferSelectModel<typeof skills>;
export type ExperienceRow = InferSelectModel<typeof experience>;
export type ContactRow = InferSelectModel<typeof contact>;
