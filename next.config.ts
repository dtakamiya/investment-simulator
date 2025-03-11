import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/investment-simulator',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
