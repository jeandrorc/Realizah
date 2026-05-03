import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // standalone only for Docker builds; Vercel manages its own output
  ...(process.env.NEXT_STANDALONE === '1' ? { output: 'standalone' } : {}),
  transpilePackages: ['@realizah/types', '@realizah/utils'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
