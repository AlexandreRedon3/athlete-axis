/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      // Désactive Turbopack si besoin, sinon supprime entièrement cette section
      turbo: false,
    },
    webpack: (config) => {
      config.optimization.moduleIds = 'deterministic';
      return config;
    },
  };
  
  module.exports = nextConfig;
  