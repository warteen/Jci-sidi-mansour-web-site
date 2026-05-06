import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./dev.db", "./prisma/dev.db"],
  },
};

export default nextConfig;
