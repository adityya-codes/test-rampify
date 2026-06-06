import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@repo/db"],
  outputFileTracingIncludes: {
    "/*": ["../../packages/db/src/generated/client/**/*"],
    "/api/**/*": ["../../packages/db/src/generated/client/**/*"],
  },
};

export default nextConfig;
