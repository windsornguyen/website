import MillionLint from '@million/lint';
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import createMDX from '@next/mdx';

const securityHeaders = [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://github.com",
          "font-src 'self' data:",
          "connect-src 'self'",
          "worker-src 'self'",
          "manifest-src 'self'",
        ].join('; '),
      },
    ],
  },
];

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  experimental: {
    mdxRs: true,
  },
  poweredByHeader: false,
  async headers() {
    return securityHeaders;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/github\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'github-images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  }),
};

export default MillionLint.next({
  enabled: true,
  rsc: true,
})(withMDX(nextConfig));

// export default withMDX(nextConfig);
