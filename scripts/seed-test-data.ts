#!/usr/bin/env tsx

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db";

const { user, program, coachClient } = schema;

// Fonction pour générer des UUID cohérents
const generateId = () => crypto.randomUUID();

// Données de test pour les coaches
const coaches = [
  {
    id: generateId(),
    name: "Marie Martin",
    email: "marie.martin@example.com",
    username: "marie_martin",
    displayUsername: "marie_martin",
    isCoach: true,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    address: "123 Rue de la Santé",
    zipCode: "75001",
    city: "Paris",
    country: "France",
    phoneNumber: "+33123456789",
    emailNotifications: true,
    smsNotifications: false,
  },
  {
    id: generateId(),
    name: "Thomas Dubois",
    email: "thomas.dubois@example.com",
    username: "thomas_dubois",
    displayUsername: "thomas_dubois",
    isCoach: true,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    address: "456 Avenue du Sport",
    zipCode: "69001",
    city: "Lyon",
    country: "France",
    phoneNumber: "+33456789012",
    emailNotifications: true,
    smsNotifications: true,
  },
  {
    id: generateId(),
    name: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    username: "sophie_laurent",
    displayUsername: "sophie_laurent",
    isCoach: true,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
    address: "789 Boulevard de la Forme",
    zipCode: "13001",
    city: "Marseille",
    country: "France",
    phoneNumber: "+33412345678",
    emailNotifications: true,
    smsNotifications: false,
  }
];

// Données de test pour les clients
const clients = [
  {
    id: generateId(),
    name: "Alexandre Dupont",
    email: "alexandre.dupont@example.com",
    username: "alex_dupont",
    displayUsername: "alex_dupont",
    isCoach: false,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date(),
    address: "321 Rue de la Musculation",
    zipCode: "75002",
    city: "Paris",
    country: "France",
    phoneNumber: "+33198765432",
    emailNotifications: true,
    smsNotifications: true,
    coachId: coaches[0].id, // Marie Martin
  },
  {
    id: generateId(),
    name: "Emma Rousseau",
    email: "emma.rousseau@example.com",
    username: "emma_rousseau",
    displayUsername: "emma_rousseau",
    isCoach: false,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date(),
    address: "654 Avenue du Cardio",
    zipCode: "69002",
    city: "Lyon",
    country: "France",
    phoneNumber: "+33487654321",
    emailNotifications: true,
    smsNotifications: false,
    coachId: coaches[1].id, // Thomas Dubois
  },
  {
    id: generateId(),
    name: "Lucas Moreau",
    email: "lucas.moreau@example.com",
    username: "lucas_moreau",
    displayUsername: "lucas_moreau",
    isCoach: false,
    onBoardingComplete: false,
    emailVerified: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date(),
    address: "987 Boulevard de la Nutrition",
    zipCode: "13002",
    city: "Marseille",
    country: "France",
    phoneNumber: "+33423456789",
    emailNotifications: false,
    smsNotifications: true,
    coachId: coaches[2].id, // Sophie Laurent
  },
  {
    id: generateId(),
    name: "Julie Bernard",
    email: "julie.bernard@example.com",
    username: "julie_bernard",
    displayUsername: "julie_bernard",
    isCoach: false,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date(),
    address: "147 Rue de la Performance",
    zipCode: "75003",
    city: "Paris",
    country: "France",
    phoneNumber: "+33134567890",
    emailNotifications: true,
    smsNotifications: true,
    coachId: coaches[0].id, // Marie Martin
  },
  {
    id: generateId(),
    name: "Pierre Leroy",
    email: "pierre.leroy@example.com",
    username: "pierre_leroy",
    displayUsername: "pierre_leroy",
    isCoach: false,
    onBoardingComplete: true,
    emailVerified: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date(),
    address: "258 Avenue de l'Endurance",
    zipCode: "69003",
    city: "Lyon",
    country: "France",
    phoneNumber: "+33445678901",
    emailNotifications: false,
    smsNotifications: true,
    coachId: coaches[1].id, // Thomas Dubois
  }
];

// Programmes de test
const programs = [
  {
    name: "Programme Débutant - Musculation",
    description: "Programme de musculation pour débutants sur 8 semaines",
    level: "Débutant" as const,
    type: "Hypertrophie" as const,
    durationWeeks: 8,
    sessionsPerWeek: 3,
    status: "published" as const,
    coachId: coaches[0].id,
    userId: coaches[0].id,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    name: "Programme Intermédiaire - Cardio",
    description: "Programme cardio-training pour niveau intermédiaire",
    level: "Intermédiaire" as const,
    type: "Cardio" as const,
    durationWeeks: 6,
    sessionsPerWeek: 4,
    status: "published" as const,
    coachId: coaches[1].id,
    userId: coaches[1].id,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date(),
  },
  {
    name: "Programme Avancé - CrossFit",
    description: "Programme CrossFit intensif pour sportifs confirmés",
    level: "Avancé" as const,
    type: "Mixte" as const,
    durationWeeks: 12,
    sessionsPerWeek: 5,
    status: "published" as const,
    coachId: coaches[2].id,
    userId: coaches[2].id,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date(),
  }
];

async function seedTestData() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("🌱 Starting to seed test data...");
  
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    // Insérer les coaches
    console.log("👨‍💼 Inserting coaches...");
    for (const coach of coaches) {
      await db.insert(user).values(coach).onConflictDoNothing();
    }

    // Insérer les clients
    console.log("👥 Inserting clients...");
    for (const client of clients) {
      await db.insert(user).values(client).onConflictDoNothing();
    }

    // Insérer les programmes
    console.log("📋 Inserting programs...");
    for (const programData of programs) {
      await db.insert(program).values(programData).onConflictDoNothing();
    }

    // Créer les relations coach-client
    console.log("🔗 Creating coach-client relationships...");
    for (const client of clients) {
      if (client.coachId) {
        await db.insert(coachClient).values({
          coachId: client.coachId,
          clientId: client.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }
    }

    console.log("✅ Test data seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - ${coaches.length} coaches created`);
    console.log(`   - ${clients.length} clients created`);
    console.log(`   - ${programs.length} programs created`);
    console.log(`   - ${clients.filter(c => c.coachId).length} coach-client relationships created`);

  } catch (error) {
    console.error("❌ Error seeding test data:", error);
    process.exit(1);
  }
}

seedTestData(); 