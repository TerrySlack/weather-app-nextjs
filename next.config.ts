import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.weatherapi.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
