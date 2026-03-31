# SEO Design — Anh Bui Portfolio

## Problem

The portfolio has minimal SEO: dynamic `<title>` and `<meta description>` on the homepage and project pages, plus basic OG/Twitter card tags on the homepage only. Missing: `metadataBase`, OG images, canonical URLs, sitemap, robots.txt, and JSON-LD structured data.

## Goal

Full SEO suite:
- `metadataBase` derived dynamically from the Host request header (multi-tenant safe, no env var needed)
- Dynamic OG images via `next/og` for homepage and all project pages
- Canonical URLs on all public pages
- `sitemap.ts` listing `/` and all `/projects/[slug]` routes
- `robots.ts` allowing all crawlers, pointing to the sitemap
- JSON-LD structured data: `Person` + `WebSite` on homepage, `WebPage` on project pages

## Approach

Centralized `lib/seo.ts` utility. All pages call into it for base URL resolution and shared metadata building. OG images served from a dedicated `app/og/route.tsx` endpoint.

## Architecture

```
lib/
  seo.ts                     ← getBaseUrl(), buildMetadata()
app/
  layout.tsx                 ← generateMetadata with metadataBase
  page.tsx                   ← extend with OG image, canonical, JSON-LD Person + WebSite
  projects/[slug]/
    page.tsx                 ← extend with OG image, canonical, JSON-LD WebPage
  og/
    route.tsx                ← ImageResponse endpoint: GET /og?title=...&description=...
  sitemap.ts                 ← dynamic: / + all /projects/[slug]
  robots.ts                  ← allow all, sitemap URL
```

## Components

### `lib/seo.ts`

Exports:

```ts
getBaseUrl(headers: ReadonlyHeaders): string
// Returns "http://localhost:PORT" for localhost, "https://HOST" otherwise.
// Reads the `host` header from Next.js `headers()`.

buildMetadata(options: {
  title: string;
  description: string;
  path: string;        // e.g. "/" or "/projects/my-project"
  baseUrl: string;
  ogTitle?: string;    // falls back to title
  ogDescription?: string; // falls back to description
}): Metadata
// Returns a full Next.js Metadata object including:
// - title, description
// - metadataBase (as URL object from baseUrl)
// - canonical alternates.canonical
// - openGraph: title, description, url, images (pointing to /og route)
// - twitter: card "summary_large_image", title, description, images
```

### `app/og/route.tsx`

`GET /og?title=...&description=...`

Returns a `1200×630` `ImageResponse`:
- Dark background (`#0a0a0a`)
- Top-left: site name ("Anh Bui") in Archivo, small, muted
- Center-left: `title` in large bold Archivo
- Below title: `description` in smaller Space Grotesk, muted, clamped to 2 lines
- Bottom accent border line

Fonts loaded inside the route handler via `fetch` from Google Fonts, then passed to `ImageResponse` as `ArrayBuffer` (not CSS imports — `next/og` requires raw font data). Example: `fetch('https://fonts.gstatic.com/...').then(r => r.arrayBuffer())`.

### `app/sitemap.ts`

`export default async function sitemap(): Promise<MetadataRoute.Sitemap>`

Queries the DB for all published projects for the `SITE_ID`. Returns entries for:
- `/` — `changeFrequency: "monthly"`, `priority: 1.0`
- `/projects/[slug]` per project — `changeFrequency: "monthly"`, `priority: 0.8`

Uses `getBaseUrl()` via the `NEXT_PUBLIC_BASE_URL` env if set, otherwise falls back to `process.env.NEXT_PUBLIC_BASE_URL` or a build-time default. Since sitemaps are static exports and cannot use request headers, the base URL for sitemaps will come from a `NEXT_PUBLIC_BASE_URL` env var (or a `SITE_URL` env var), defaulting to `http://localhost:3000` if unset.

> **Note:** Sitemap generation runs at build/request time outside of a request context, so `headers()` is unavailable. A `SITE_URL` env var is used exclusively for the sitemap. All other SEO uses dynamic header-based resolution.

### `app/robots.ts`

`export default function robots(): MetadataRoute.Robots`

Returns:
```ts
{
  rules: { userAgent: "*", allow: "/" },
  sitemap: `${siteUrl}/sitemap.xml`,
}
```

Where `siteUrl` comes from `process.env.SITE_URL || "http://localhost:3000"` — same fallback logic as the sitemap.

### JSON-LD — Homepage (`app/page.tsx`)

Two schemas inlined as `<script type="application/ld+json">` rendered inside the page's JSX (not in layout, so they stay page-specific).

**`WebSite`:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "<hero.name>",
  "url": "<baseUrl>",
  "description": "<hero.description>"
}
```

**`Person`:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "<hero.name>",
  "jobTitle": "<hero.tagline>",
  "url": "<baseUrl>",
  "sameAs": ["<github_url>", "<linkedin_url>", "<twitter_url>"]
}
```

`sameAs` is built from contact links in the DB that have `http://` or `https://` URLs only. `mailto:` and other non-URL link types are excluded (invalid in `schema.org/sameAs`). Only non-null links are included.

### JSON-LD — Project Pages (`app/projects/[slug]/page.tsx`)

**`WebPage`:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "<project.title>",
  "description": "<project.description>",
  "url": "<baseUrl>/projects/<slug>"
}
```

### Metadata Updates

**`app/layout.tsx`:**
- Convert static `metadata` export to `async generateMetadata()` that calls `headers()` and sets `metadataBase` dynamically.
- Keep the fallback title/description for the layout level.

**`app/page.tsx`:**
- Extend existing `generateMetadata()` to call `buildMetadata()` from `lib/seo.ts`.
- Add OG image pointing to `/og?title=...&description=...`.
- Add canonical URL.

**`app/projects/[slug]/page.tsx`:**
- Extend existing `generateMetadata()` to call `buildMetadata()`.
- Add OG image, canonical URL.
- Add Twitter card metadata.

## Data Flow

```
Request → page.tsx generateMetadata()
  → headers() → getBaseUrl() → baseUrl
  → DB query → title, description
  → buildMetadata() → Metadata object
      → /og?title=...&description=... (OG image URL)
      → canonical: baseUrl + path
      → openGraph, twitter fields
```

## Error Handling

- If `host` header is missing (edge case), `getBaseUrl()` falls back to `http://localhost:3000`.
- If DB query fails in sitemap, return only the homepage entry.
- OG image route: if `title`/`description` params are missing, use sensible defaults ("Anh Bui", "Frontend Developer").

## Out of Scope

- PWA / `manifest.json`
- `BreadcrumbList` structured data
- Per-language/locale hreflang tags
- Analytics or tracking scripts
