import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      // Import/Export rules
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      
      // Unused imports
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Désactiver temporairement les règles bloquantes pour le build
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "off", // Désactivé temporairement
      "no-process-env": "off", // Nécessaire pour les variables d'environnement
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
      
      // Règles de sécurité de base (sans nécessiter d'informations de type)
      "@typescript-eslint/no-var-requires": "error",
    },
  },
];

export default eslintConfig;
