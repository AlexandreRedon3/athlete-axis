import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db";

// Configuration optimisée pour Neon
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Client SQL optimisé pour Neon
export const sql = neon(process.env.DATABASE_URL);

// Instance Drizzle avec le schéma et logs désactivés
export const db = drizzle(sql, { 
  schema,
  logger: false, // Désactive les logs de requêtes SQL
}); 