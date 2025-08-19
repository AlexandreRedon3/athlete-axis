/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      turbo: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
    },
    webpack: (config) => {
      config.optimization.moduleIds = 'deterministic';        
      return config;
    },
  };
  
  module.exports = nextConfig;
  