#!/usr/bin/env tsx

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "../src/db";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("🔄 Starting migration...");
  console.log("📡 Connecting to Neon database...");
  
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    await migrate(db, { migrationsFolder: "./src/drizzle" });
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main(); 