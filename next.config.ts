import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to complete even with TypeScript errors
    // Only use for temporary fixes - should resolve errors properly in production
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
