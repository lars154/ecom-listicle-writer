import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Images are pre-optimized to WebP
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;


