import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash for placeholder images during development
      { protocol: "https", hostname: "images.unsplash.com" },
      // Add your CDN hostname here once assets are on a real host:
      // { protocol: "https", hostname: "cdn.uroojinternational.com" },
    ],
  },
  // Enable React strict mode for better development warnings
  reactStrictMode: true,
};

export default nextConfig;
