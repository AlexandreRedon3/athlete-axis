#!/usr/bin/env tsx

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db";

const { user, coachClient, program } = schema;
const now = () => new Date();

// Emails des coachs et clients
const coaches = [
  { email: "marie.martin@example.com" },
  { email: "thomas.dubois@example.com" },
  { email: "sophie.laurent@example.com" },
];
const clients = [
  { email: "alexandre.dupont@example.com", coachEmail: "marie.martin@example.com" },
  { email: "emma.rousseau@example.com", coachEmail: "thomas.dubois@example.com" },
  { email: "lucas.moreau@example.com", coachEmail: "sophie.laurent@example.com" },
  { email: "julie.bernard@example.com", coachEmail: "marie.martin@example.com" },
  { email: "pierre.leroy@example.com", coachEmail: "thomas.dubois@example.com" },
];

const programs = [
  {
    name: "Programme Débutant - Musculation",
    description: "Programme de musculation pour débutants sur 8 semaines",
    level: "Débutant" as const,
    type: "Hypertrophie" as const,
    durationWeeks: 8,
    sessionsPerWeek: 3,
    status: "published" as const,
    coachEmail: "marie.martin@example.com",
    userEmail: "marie.martin@example.com",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    name: "Programme Intermédiaire - Cardio",
    description: "Programme cardio-training pour niveau intermédiaire",
    level: "Intermédiaire" as const,
    type: "Cardio" as const,
    durationWeeks: 6,
    sessionsPerWeek: 4,
    status: "published" as const,
    coachEmail: "thomas.dubois@example.com",
    userEmail: "thomas.dubois@example.com",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    name: "Programme Avancé - CrossFit",
    description: "Programme CrossFit intensif pour sportifs confirmés",
    level: "Avancé" as const,
    type: "Mixte" as const,
    durationWeeks: 12,
    sessionsPerWeek: 5,
    status: "published" as const,
    coachEmail: "sophie.laurent@example.com",
    userEmail: "sophie.laurent@example.com",
    createdAt: now(),
    updatedAt: now(),
  },
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  // Récupérer tous les users créés
  const usersInDb = await db.select().from(user);
  const emailToId = Object.fromEntries(usersInDb.map(u => [u.email, u.id]));

  // Créer les relations coach-client
  console.log("🤝 Insertion des relations coach-client...");
  for (const c of clients) {
    await db.insert(coachClient).values({
      coachId: emailToId[c.coachEmail],
      clientId: emailToId[c.email],
      createdAt: now(),
      updatedAt: now(),
    });
  }

  // Créer les programmes
  console.log("📋 Insertion des programmes...");
  for (const p of programs) {
    await db.insert(program).values({
      ...p,
      coachId: emailToId[p.coachEmail],
      userId: emailToId[p.userEmail],
    });
  }

  console.log("✅ Relations et programmes insérés !");
}

main(); 