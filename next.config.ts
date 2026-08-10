import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "standalone" to fix Vercel .nft.json trace error
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
