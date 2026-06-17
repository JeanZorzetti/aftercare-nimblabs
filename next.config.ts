import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Force the file-tracing root to this project. Without it, Next walks up past
  // OneDrive (multiple lockfiles) and nests standalone output under the full path,
  // so `.next/standalone/server.js` ends up missing. Pin it to __dirname.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Hashed JS/CSS chunks — safe to cache forever (filename changes on every build)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public assets (images, fonts, icons) — cache for 1 year
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // robots.txt and sitemap — short cache so GSC picks up changes quickly
        source: "/(robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
