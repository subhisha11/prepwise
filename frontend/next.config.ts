import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  experimental: { optimizePackageImports: ["lucide-react"] },
};

export default nextConfig;
