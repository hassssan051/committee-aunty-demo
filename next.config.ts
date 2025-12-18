import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly enable Turbopack for Next.js 16+
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("pino-pretty", "lokijs", "encoding");
    }
    // Make optional connector packages truly optional
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    Object.assign(config.resolve.alias, {
      "@base-org/account": false,
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Suppress source map warnings
    config.ignoreWarnings = [{ module: /node_modules/ }, /Invalid source map/];
    return config;
  },
};

export default nextConfig;
