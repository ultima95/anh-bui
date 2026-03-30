# Portfolio — Anh Bui

A Next.js portfolio site with a CMS-style admin panel. Content (hero, about, projects, skills, experience, contact) is stored in PostgreSQL and managed through `/admin`. Designed to support multiple independent portfolio sites from a single codebase via `SITE_ID`.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (v2.x+)
- `openssl` for generating secrets (available on macOS/Linux by default)

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repo-url> portfolio
cd portfolio

# 2. Create your environment file
cp .env.example .env

# 3. Fill in the required values (see Environment Variables below)
#    At minimum: SESSION_SECRET, SITE_ID, and POSTGRES_PASSWORD
nano .env

# 4. Boot the stack
docker compose up

# 5. Visit http://localhost:3000
```

On first boot, `docker compose up`:
1. Starts PostgreSQL and waits until it is healthy
2. Runs database migrations (bundled into the app container entrypoint)
3. Starts the Next.js app on port 3000

---

## First-Time Setup

After the stack is running, create your admin password:

1. Open [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup)
2. Enter a password — it is stored as a bcrypt hash in the database
3. Log in at [http://localhost:3000/admin](http://localhost:3000/admin)
4. Fill in your content from the admin panel

> **Note:** The `/admin/setup` route is only available when no admin password has been set. It becomes unavailable once the password is configured.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values before running `docker compose up`.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. Use `postgres` as the hostname inside Docker Compose. |
| `SITE_ID` | ✅ | Short slug identifying this portfolio site (e.g. `anh`). Scopes all database rows. |
| `SESSION_SECRET` | ✅ | Min 32-char random string for session encryption. Generate: `openssl rand -hex 32` |
| `POSTGRES_PASSWORD` | ✅ | Password for the `postgres` database user (used by the Docker Compose postgres service). |
| `S3_ENDPOINT` | — | URL of your S3-compatible storage (e.g. MinIO). Required for image uploads. |
| `S3_BUCKET` | — | Bucket name for uploaded images. |
| `S3_ACCESS_KEY` | — | S3 access key ID. |
| `S3_SECRET_KEY` | — | S3 secret access key. |
| `S3_REGION` | — | S3 region (default: `us-east-1`). |

Generate a strong session secret:

```bash
openssl rand -hex 32
```

---

## Seeding Development Data (Optional)

The seed script inserts representative data for local development. It is idempotent — it clears and re-inserts rows for the active `SITE_ID`.

```bash
# From a running local dev environment (not Docker):
SITE_ID=anh npm run db:seed

# Or directly:
SITE_ID=anh npx tsx scripts/seed.ts
```

> **Warning:** The seed script deletes all existing rows for the given `SITE_ID` before inserting. Do not run it against a production database.

---

## Multi-Site: Running Multiple Portfolios

`SITE_ID` scopes all database content to a single portfolio. Multiple deployments can share one PostgreSQL instance — each with a different `SITE_ID`.

**Example: two sites sharing one database**

```bash
# Site 1: .env
SITE_ID=anh
DATABASE_URL=postgresql://postgres:password@db:5432/portfolio

# Site 2: .env (separate deployment)
SITE_ID=jane
DATABASE_URL=postgresql://postgres:password@db:5432/portfolio
```

Each site manages its own content independently through its own `/admin` panel. There is no cross-site data leakage — all queries filter on `site_id`.

**Running a second site locally:**

```bash
# Clone to a separate directory
git clone <repo-url> portfolio-jane
cd portfolio-jane

cp .env.example .env
# Set SITE_ID=jane, same DATABASE_URL as site 1, different port
# Edit docker-compose.yml ports: "3001:3000"

docker compose up
```

---

## S3 Image Uploads

Image uploads (project thumbnails, etc.) use an S3-compatible storage backend. [MinIO](https://min.io/) is recommended for self-hosting.

Set the following variables in `.env`:

```dotenv
S3_ENDPOINT=https://your-minio.example.com
S3_BUCKET=portfolio
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=us-east-1
```

If these variables are omitted, the image upload feature is disabled and images are not accepted by the API.

---

## Local Development (Without Docker)

For fast iteration without containers:

```bash
# 1. Install dependencies
npm install

# 2. Start a local PostgreSQL instance (e.g. via Homebrew or a cloud DB)

# 3. Create a local env file (Next.js reads this over .env)
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL to your local postgres (hostname: localhost)

# 4. Run migrations
npm run db:migrate

# 5. Optionally seed development data
npm run db:seed

# 6. Start the dev server (hot reload enabled)
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

**Useful scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed development data for current `SITE_ID` |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

---

## Project Structure

```
app/
  (site)/           # Public portfolio pages
  admin/
    (protected)/    # Admin pages (require authentication)
    login/          # Login page (public)
    setup/          # First-time password setup (public)
src/
  lib/
    schema.ts       # Drizzle ORM schema
    db.ts           # Database connection
  actions/          # Next.js server actions
scripts/
  migrate.ts        # Migration runner
  seed.ts           # Development data seeder
docker-compose.yml  # Full stack: postgres + app (migrations run on startup)
Dockerfile          # Multi-stage build (builder → runner)
.env.example        # Environment variable template
```
