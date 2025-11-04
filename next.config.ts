import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pg', 'better-sqlite3'],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    BUILD_TIME: process.env.BUILD_TIME,
  },
  async headers() {
    return [
      {
        // Allow iframe embedding for WordPress integration
        source: '/embed/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
