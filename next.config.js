const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuration des images pour UploadThing et autres services
  images: {
    remotePatterns: [
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
      {
        hostname: "cdn.magicui.design",
        protocol: "https",
      },
      {
        hostname: "randomuser.me",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "sea1.ingest.uploadthing.com",
        protocol: "https",
      },
      {
        hostname: "utfs.io",
        protocol: "https",
      },
    ],
  },

  // Configuration Webpack pour éviter les conflits avec better-call
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // Ignorer better-call côté client pour éviter les erreurs
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'better-call': false,
      };
    }

    return config;
  },

  // Optimisations pour Vercel
  outputFileTracing: true,
  poweredByHeader: false,
};

module.exports = withNextIntl(nextConfig); 