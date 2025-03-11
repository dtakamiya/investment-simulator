/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/investment-simulator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/investment-simulator/' : '',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    forceSwcTransforms: true
  }
};

module.exports = nextConfig; 