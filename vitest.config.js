const path = require('path')

module.exports = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      // Fichiers de configuration
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mjs',
      '**/next.config.js',
      '**/tailwind.config.ts',
      '**/postcss.config.js',
      '**/postcss.config.mjs',
      '**/drizzle.config.ts',
      '**/vitest.config.js',
      '**/eslint.config.mjs',
      '**/i18n.config.js',
      '**/next-intl.config.js',
      
      // Fichiers de types
      '**/*.d.ts',
      '**/types/**',
      '**/src/types/**',
      
      // Fichiers de test
      '**/__test__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test/**',
      
      // Fichiers de build/générés
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      
      // Fichiers de migration/seeding
      '**/scripts/**',
      '**/drizzle/**',
      '**/migrations/**',
      
      // Fichiers de documentation
      '**/*.md',
      '**/README.md',
      '**/ADMIN_API.md',
      '**/NEON_SETUP.md',
      
      // Fichiers de monitoring/docker
      '**/docker/**',
      '**/monitoring/**',
      '**/backups/**',
      '**/exports/**',
      
      // Fichiers de configuration spécifiques
      '**/env.ts',
      '**/auth-schema.ts',
      '**/middleware.ts',
      '**/main.yml',
      '**/Makefile',
      '**/package.json',
      '**/package-lock.json',
      '**/tsconfig.json',
      '**/swagger-ui-react.d.ts',
      
      // Fichiers publics
      '**/public/**',
      
      // Fichiers de composants UI non testés
      '**/src/components/ui/**',
      '**/src/components/landing-page/**',
      '**/src/components/onboarding/**',
      
      // Fichiers de pages non testés
      '**/app/**',
      '**/src/components/landing-page/**',
      
      // Fichiers de contexte non testés
      '**/src/context/**',
      '**/src/i18n/**',
      '**/src/server/**',
      
      // Fichiers de lib non testés
      '**/src/lib/auth-client.ts',
      '**/src/lib/auth-roles.ts',
      '**/src/lib/auth.ts',
      '**/src/lib/db.ts',
      '**/src/lib/env.ts',
      '**/src/lib/index.ts',
      '**/src/lib/logger.ts',
      '**/src/lib/metrics.ts',
      '**/src/lib/neon.ts',
      '**/src/lib/stripe.ts',
      '**/src/lib/theme-provider.tsx',
      '**/src/lib/utils.ts',
      '**/src/lib/validations/**',
    ],
    include: [
      'src/hooks/**',
      'src/db/**',
      'src/lib/refresh-store.ts',
    ],
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