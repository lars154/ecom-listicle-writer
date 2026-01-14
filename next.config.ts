import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (repo name)
  basePath: '/ecom-listicle-writer',
  
  images: {
    // Use unoptimized images for static export (images are pre-optimized)
    unoptimized: true,
  },
  
  // Trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;


