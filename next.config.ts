import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace root detection for Vercel
  outputFileTracingRoot: path.join(__dirname),

  // Ensure proper image handling
  images: {
    domains: ['www.layover-ai.com'],
  },
};

export default nextConfig;
