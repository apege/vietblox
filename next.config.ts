import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.rbxcdn.com",
      },
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
      },
      {
        protocol: "https",
        hostname: "**.roblox.com",
      },
      {
        protocol: "https",
        hostname: "roblox.com",
      },
    ],
  },
};

export default nextConfig;
