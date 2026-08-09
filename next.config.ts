import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "standalone" to fix Vercel .nft.json trace error
  serverActions: {
    bodySizeLimit: '10mb',
  },
};

export default nextConfig;
