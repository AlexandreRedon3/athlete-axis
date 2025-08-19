/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Correction : objet au lieu de booléen
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Autres options expérimentales si nécessaires
    serverComponentsExternalPackages: ['better-auth'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configuration spécifique pour better-auth
  webpack: (config, { dev, isServer }) => {
    config.optimization.moduleIds = 'deterministic';
    
    // Correction pour better-auth/better-call
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Exclure better-auth du bundling côté client si nécessaire
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
  // Optimisations pour la compatibilité
  transpilePackages: ['better-auth', 'better-call'],
};

module.exports = nextConfig;