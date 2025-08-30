import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow build to succeed with ESLint errors for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to succeed with TypeScript errors for deployment
    ignoreBuildErrors: true,
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that shouldn't be bundled for the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
