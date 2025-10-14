import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pg', 'better-sqlite3']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  }
};

export default nextConfig;
