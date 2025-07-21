const path = require('path')

module.exports = {
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/db': path.resolve(__dirname, './src/db'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
} 