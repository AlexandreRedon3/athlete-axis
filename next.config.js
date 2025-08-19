/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Nouvelle syntaxe Next.js 15
  serverExternalPackages: ['better-auth', 'better-call'],
    
  // Configuration Webpack pour gérer better-auth côté client
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
    return config;
  },
  
  // Optimisations pour Vercel
  outputFileTracing: true,
  poweredByHeader: false,
};

module.exports = nextConfig;