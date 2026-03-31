import type { Metadata } from "next";

/**
 * Derives the base URL from the incoming request's Host header.
 * Uses http:// for localhost/127.0.0.1, https:// for everything else.
 * Falls back to http://localhost:3000 if the header is absent.
 */
export function getBaseUrl(headers: { get(name: string): string | null }): string {
  const host = headers.get("host") ?? "localhost:3000";
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = isLocal ? "http" : "https";
  return `${protocol}://${host}`;
}

/**
 * Builds a full Next.js Metadata object for a given page.
 * Relies on metadataBase being set in the root layout's generateMetadata
 * so that relative OG image URLs and canonical paths are resolved correctly.
 */
export function buildMetadata(options: {
  title: string;
  description: string;
  /** Absolute path, e.g. "/" or "/projects/my-project" */
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const ogTitle = options.ogTitle ?? options.title;
  const ogDescription = options.ogDescription ?? options.description;
  const ogImageUrl = `/og?${new URLSearchParams({
    title: ogTitle,
    description: ogDescription,
  }).toString()}`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      // Next.js resolves this relative path against metadataBase
      canonical: options.path,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: options.path,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}
