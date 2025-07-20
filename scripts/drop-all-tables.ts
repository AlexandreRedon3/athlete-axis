#!/usr/bin/env tsx

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db";

const { user, account, coachClient, program, session, invites } = schema;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🧹 Suppression de toutes les données des tables principales...");
  await db.delete(coachClient);
  await db.delete(program);
  await db.delete(account);
  await db.delete(session);
  await db.delete(invites);
  await db.delete(user);

  console.log("✅ Toutes les données ont été supprimées (tables vides).");
}

main();