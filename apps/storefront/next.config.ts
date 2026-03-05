import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@realizah/types', '@realizah/utils'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
