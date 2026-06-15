import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // basePath matches the GitHub repo name so Pages URLs resolve correctly
  basePath: isProd ? '/genqi' : '',
  images: { unoptimized: true },
};

export default nextConfig;
