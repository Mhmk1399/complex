import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['http://localhost:3000',"raw.githubusercontent.com"],
  },
};

export default nextConfig;
