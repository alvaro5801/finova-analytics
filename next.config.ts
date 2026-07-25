import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client and libsql are auto-externalized by Next.js, but the Prisma
  // adapter wrapping them isn't — without this it can get bundled in a way that
  // breaks native binding resolution on Vercel's serverless runtime.
  serverExternalPackages: ["@prisma/adapter-libsql"],
};

export default nextConfig;
