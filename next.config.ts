import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tdmu.edu.vn',
        pathname: '/img/brand/**',
      },
      {
        protocol: 'https',
        hostname: 'nks.com.vn',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/npm/simple-icons@v16/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/glincker/thesvg@main/public/icons/**',
      },
    ],
  },
};

export default nextConfig;
