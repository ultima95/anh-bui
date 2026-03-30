/**
 * migrate.ts — runs pending Drizzle migrations against DATABASE_URL.
 * Called on container startup before the Next.js server starts.
 *
 * Usage: npx tsx scripts/migrate.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "path";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("[migrate] ERROR: DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("[migrate] Connecting to database...");
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  const migrationsFolder = path.join(process.cwd(), "drizzle");
  console.log(`[migrate] Running migrations from ${migrationsFolder}`);

  await migrate(db, { migrationsFolder });

  console.log("[migrate] Migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("[migrate] Migration failed:", err);
  process.exit(1);
});
