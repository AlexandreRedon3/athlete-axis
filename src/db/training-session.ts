import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { exercise } from "./exercice";
import { program } from "./program";

export const trainingSession = pgTable("trainingSession", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    order: integer("order").notNull(),
    programId: text("programId").notNull().references(() => program.id, { onDelete: "cascade" }),
    description: text("description"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const trainingSessionRelations = relations(trainingSession, ({ one, many }) => ({
    program: one(program, {
        fields: [trainingSession.programId],
        references: [program.id],
    }),
    exercises: many(exercise),
}));

export type TrainingSession = InferSelectModel<typeof trainingSession>;

export const createTrainingSessionSchema = createInsertSchema(trainingSession);
export const updateTrainingSessionSchema = createTrainingSessionSchema.partial();