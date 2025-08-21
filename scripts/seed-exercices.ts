// scripts/seed-exercises.ts
import { db } from "../src/lib/db";
import { exerciseLibrary } from "../src/db/exercise-library";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db";
import "dotenv/config";

const exercises = [
  // PUSH (Poussée)
  {
    id: "ex-1",
    name: "Développé couché barre",
    category: "push",
    primaryMuscles: ["pectoraux", "triceps"],
    secondaryMuscles: ["deltoïdes antérieurs"],
    equipment: "barbell",
    instructions: "Allongé sur le banc, descendez la barre jusqu'à la poitrine puis poussez jusqu'à extension complète.",
  },
  {
    id: "ex-2",
    name: "Développé incliné haltères",
    category: "push",
    primaryMuscles: ["pectoraux supérieurs"],
    secondaryMuscles: ["triceps", "deltoïdes antérieurs"],
    equipment: "dumbbell",
    instructions: "Sur un banc incliné à 30-45°, descendez les haltères de chaque côté puis poussez en rapprochant les haltères.",
  },
  {
    id: "ex-3",
    name: "Dips",
    category: "push",
    primaryMuscles: ["pectoraux inférieurs", "triceps"],
    secondaryMuscles: ["deltoïdes antérieurs"],
    equipment: "bodyweight",
    instructions: "Penchez-vous légèrement en avant pour cibler les pectoraux, descendez jusqu'à 90° aux coudes.",
  },
  {
    id: "ex-4",
    name: "Développé militaire",
    category: "push",
    primaryMuscles: ["deltoïdes"],
    secondaryMuscles: ["triceps", "trapèzes"],
    equipment: "barbell",
    instructions: "Debout ou assis, poussez la barre au-dessus de la tête jusqu'à extension complète.",
  },

  // PULL (Tirage)
  {
    id: "ex-5",
    name: "Tractions pronation",
    category: "pull",
    primaryMuscles: ["grand dorsal", "biceps"],
    secondaryMuscles: ["rhomboïdes", "trapèzes moyens"],
    equipment: "bodyweight",
    instructions: "Prise largeur épaules, tirez-vous jusqu'à passer le menton au-dessus de la barre.",
  },
  {
    id: "ex-6",
    name: "Rowing barre",
    category: "pull",
    primaryMuscles: ["grand dorsal", "rhomboïdes"],
    secondaryMuscles: ["biceps", "trapèzes"],
    equipment: "barbell",
    instructions: "Penché à 45°, tirez la barre vers le nombril en gardant les coudes près du corps.",
  },
  {
    id: "ex-7",
    name: "Tirage horizontal câble",
    category: "pull",
    primaryMuscles: ["grand dorsal", "rhomboïdes"],
    secondaryMuscles: ["biceps", "deltoïdes postérieurs"],
    equipment: "cable",
    instructions: "Assis, tirez la poignée vers l'abdomen en rapprochant les omoplates.",
  },

  // LEGS (Jambes)
  {
    id: "ex-8",
    name: "Squat barre",
    category: "legs",
    primaryMuscles: ["quadriceps", "fessiers"],
    secondaryMuscles: ["ischio-jambiers", "mollets"],
    equipment: "barbell",
    instructions: "Descendez jusqu'à ce que les cuisses soient parallèles au sol, puis remontez.",
  },
  {
    id: "ex-9",
    name: "Soulevé de terre roumain",
    category: "legs",
    primaryMuscles: ["ischio-jambiers", "fessiers"],
    secondaryMuscles: ["érecteurs du rachis"],
    equipment: "barbell",
    instructions: "Genoux légèrement fléchis, descendez la barre en poussant les hanches vers l'arrière.",
  },
  {
    id: "ex-10",
    name: "Fentes marchées",
    category: "legs",
    primaryMuscles: ["quadriceps", "fessiers"],
    secondaryMuscles: ["ischio-jambiers", "mollets"],
    equipment: "dumbbell",
    instructions: "Faites un grand pas en avant et descendez jusqu'à 90° au genou avant.",
  },
  {
    id: "ex-11",
    name: "Leg curl",
    category: "legs",
    primaryMuscles: ["ischio-jambiers"],
    secondaryMuscles: ["mollets"],
    equipment: "machine",
    instructions: "Allongé ou assis, fléchissez les genoux pour amener les talons vers les fesses.",
  },

  // CORE (Abdominaux)
  {
    id: "ex-12",
    name: "Planche",
    category: "core",
    primaryMuscles: ["abdominaux", "transverse"],
    secondaryMuscles: ["érecteurs du rachis"],
    equipment: "bodyweight",
    instructions: "Maintenez la position sur les avant-bras, corps aligné de la tête aux pieds.",
  },
  {
    id: "ex-13",
    name: "Crunch à la poulie",
    category: "core",
    primaryMuscles: ["grand droit"],
    secondaryMuscles: ["obliques"],
    equipment: "cable",
    instructions: "À genoux, fléchissez le tronc en tirant la corde vers le bas.",
  },

  // ARMS (Bras)
  {
    id: "ex-14",
    name: "Curl biceps barre",
    category: "arms",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["avant-bras"],
    equipment: "barbell",
    instructions: "Debout, fléchissez les coudes pour monter la barre vers les épaules.",
  },
  {
    id: "ex-15",
    name: "Extension triceps poulie haute",
    category: "arms",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: "cable",
    instructions: "Coudes fixes le long du corps, étendez les avant-bras vers le bas.",
  },
];

async function seedExercises() {
  console.log("🌱 Seeding exercise library...");
  console.log(process.env.DATABASE_URL);
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  
  try {
    // Vider la table existante
    await db.delete(exerciseLibrary);
    
    // Insérer les nouveaux exercices
    for (const exercise of exercises) {
      await db.insert(exerciseLibrary).values({
        ...exercise,
        createdAt: new Date(),
      });
    }
    
    console.log(`✅ ${exercises.length} exercices ajoutés avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

// Exécuter le seed
seedExercises().then(() => {
  console.log("✨ Seed terminé");
  process.exit(0);
});