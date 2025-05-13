/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      turbo: false,
    },
    webpack: (config) => {
      config.optimization.moduleIds = 'deterministic';        
      return config;
    },
  };
  
  module.exports = nextConfig;
  