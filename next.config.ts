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
};

export default nextConfig;
