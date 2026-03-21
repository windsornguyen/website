import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const securityHeaders = [
  {
    source: "/(.*)",
    headers: [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://github.com",
          "font-src 'self' data:",
          "connect-src 'self'",
          "worker-src 'self'",
          "manifest-src 'self'",
        ].join("; "),
      },
    ],
  },
];

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  typescript: { ignoreBuildErrors: false },
  logging: {
    browserToTerminal: "warn",
  },
  experimental: {
    mdxRs: true,
  },
  poweredByHeader: false,
  async headers() {
    return securityHeaders;
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
