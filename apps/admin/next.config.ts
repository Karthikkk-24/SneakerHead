import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sneakerhead/types"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
