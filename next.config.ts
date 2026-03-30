import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // S3-compatible storage for project images (MinIO or equivalent)
      // Wildcard hostname — tighten to specific S3 endpoint in production
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
