import type { NextConfig } from 'next';

const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  distDir: 'dist',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
        pathname: '/api/character/avatar/**',
      },
    ],
  },
};

export default nextConfig;
