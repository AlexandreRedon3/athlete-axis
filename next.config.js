/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      // Désactiver Turbo pour éviter les problèmes de build
      turbo: false,
    },
    webpack: (config) => {
      config.optimization.moduleIds = 'deterministic';        
      return config;
    },
  };
  
  module.exports = nextConfig;
  