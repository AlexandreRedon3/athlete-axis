#!/usr/bin/env tsx

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db";
import bcrypt from "bcryptjs";

const { user, account, coachClient, program } = schema;

const generateId = () => crypto.randomUUID();
const now = () => new Date();

// 1. Générer tous les IDs à l'avance
const coachIds = [generateId(), generateId(), generateId()];
const clientIds = [generateId(), generateId(), generateId(), generateId(), generateId()];

// 2. Définir les users (coachs et clients)
const coaches = [
  {
    id: coachIds[0], name: "Marie Martin", email: "marie.martin@example.com", username: "marie_martin", displayUsername: "marie_martin", isCoach: true, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "123 Rue de la Santé", zipCode: "75001", city: "Paris", country: "France", phoneNumber: "+33123456789", emailNotifications: true, smsNotifications: false,
  },
  {
    id: coachIds[1], name: "Thomas Dubois", email: "thomas.dubois@example.com", username: "thomas_dubois", displayUsername: "thomas_dubois", isCoach: true, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "456 Avenue du Sport", zipCode: "69001", city: "Lyon", country: "France", phoneNumber: "+33456789012", emailNotifications: true, smsNotifications: true,
  },
  {
    id: coachIds[2], name: "Sophie Laurent", email: "sophie.laurent@example.com", username: "sophie_laurent", displayUsername: "sophie_laurent", isCoach: true, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "789 Boulevard de la Forme", zipCode: "13001", city: "Marseille", country: "France", phoneNumber: "+33412345678", emailNotifications: true, smsNotifications: false,
  },
];
const clients = [
  {
    id: clientIds[0], name: "Alexandre Dupont", email: "alexandre.dupont@example.com", username: "alex_dupont", displayUsername: "alex_dupont", isCoach: false, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "321 Rue de la Musculation", zipCode: "75002", city: "Paris", country: "France", phoneNumber: "+33198765432", emailNotifications: true, smsNotifications: true, coachId: coachIds[0],
  },
  {
    id: clientIds[1], name: "Emma Rousseau", email: "emma.rousseau@example.com", username: "emma_rousseau", displayUsername: "emma_rousseau", isCoach: false, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "654 Avenue du Cardio", zipCode: "69002", city: "Lyon", country: "France", phoneNumber: "+33487654321", emailNotifications: true, smsNotifications: false, coachId: coachIds[1],
  },
  {
    id: clientIds[2], name: "Lucas Moreau", email: "lucas.moreau@example.com", username: "lucas_moreau", displayUsername: "lucas_moreau", isCoach: false, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "987 Boulevard de la Nutrition", zipCode: "13002", city: "Marseille", country: "France", phoneNumber: "+33423456789", emailNotifications: false, smsNotifications: true, coachId: coachIds[2],
  },
  {
    id: clientIds[3], name: "Julie Bernard", email: "julie.bernard@example.com", username: "julie_bernard", displayUsername: "julie_bernard", isCoach: false, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "147 Rue de la Performance", zipCode: "75003", city: "Paris", country: "France", phoneNumber: "+33134567890", emailNotifications: true, smsNotifications: true, coachId: coachIds[0],
  },
  {
    id: clientIds[4], name: "Pierre Leroy", email: "pierre.leroy@example.com", username: "pierre_leroy", displayUsername: "pierre_leroy", isCoach: false, onBoardingComplete: true, emailVerified: true, createdAt: now(), updatedAt: now(), address: "258 Avenue de l'Endurance", zipCode: "69003", city: "Lyon", country: "France", phoneNumber: "+33445678901", emailNotifications: false, smsNotifications: true, coachId: coachIds[1],
  },
];
const allUsers = [...coaches, ...clients];

// 3. Définir les comptes (accounts)
const coachClients = clients.map(c => ({
  coachId: c.coachId,
  clientId: c.id,
  createdAt: now(),
  updatedAt: now(),
}));

// 5. Définir les programmes
const programs = [
  {
    id: generateId(),
    name: "Programme Débutant - Musculation",
    description: "Programme de musculation pour débutants sur 8 semaines",
    level: "Débutant" as const,
    type: "Hypertrophie" as const,
    durationWeeks: 8,
    sessionsPerWeek: 3,
    status: "published" as const,
    coachId: coachIds[0],
    userId: coachIds[0],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Programme Intermédiaire - Cardio",
    description: "Programme cardio-training pour niveau intermédiaire",
    level: "Intermédiaire" as const,
    type: "Cardio" as const,
    durationWeeks: 6,
    sessionsPerWeek: 4,
    status: "published" as const,
    coachId: coachIds[1],
    userId: coachIds[1],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Programme Avancé - CrossFit",
    description: "Programme CrossFit intensif pour sportifs confirmés",
    level: "Avancé" as const,
    type: "Mixte" as const,
    durationWeeks: 12,
    sessionsPerWeek: 5,
    status: "published" as const,
    coachId: coachIds[2],
    userId: coachIds[2],
    createdAt: now(),
    updatedAt: now(),
  },
];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  // 1. Purge
  console.log("🧹 Purge des tables...");
  await db.delete(schema.session);
  await db.delete(coachClient);
  await db.delete(program);
  await db.delete(account);
  await db.delete(user);

  // 2. Insert users
  console.log("👤 Insertion des users...");
  for (const u of allUsers) {
    await db.insert(user).values(u);
  }

  // 3. Insert accounts
  console.log("🔑 Insertion des comptes...");
  const password = await bcrypt.hash("azerty123", 10);
  for (const u of allUsers) {
    await db.insert(account).values({
      id: generateId(),
      accountId: u.id,
      providerId: "credentials",
      userId: u.id,
      password,
      createdAt: now(),
      updatedAt: now(),
    });
  }

  // 4. Insert coach-client
  console.log("🤝 Insertion des relations coach-client...");
  for (const cc of coachClients) {
    await db.insert(coachClient).values(cc);
  }

  // 5. Insert programs
  console.log("📋 Insertion des programmes...");
  for (const p of programs) {
    await db.insert(program).values(p);
  }

  console.log("✅ Base de test Better Auth prête !");
  console.log("Tous les users : azerty123");
}

main(); 