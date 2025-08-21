import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const exerciseLibrary = pgTable("exerciseLibrary", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    category: text("category").notNull(), // push, pull, legs, core, cardio
    primaryMuscles: text("primaryMuscles").array().notNull(),
    secondaryMuscles: text("secondaryMuscles").array(),
    equipment: text("equipment"), // barbell, dumbbell, machine, bodyweight, etc.
    instructions: text("instructions"),
    videoUrl: text("videoUrl"),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type ExerciseLibraryItem = InferSelectModel<typeof exerciseLibrary>;

export const createExerciseLibrarySchema = createInsertSchema(exerciseLibrary);