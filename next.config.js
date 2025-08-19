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

  // Configuration Webpack pour éviter les conflits
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

    // Exclure better-call du bundle client
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-call');
    }

    return config;
  },

  // Optimisations pour Vercel
  poweredByHeader: false,
};

module.exports = withNextIntl(nextConfig); 