import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { trainingSession } from "./training-session";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { workoutLog } from "./workout-log";

export const exercise = pgTable("exercise", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    sets: integer("sets").notNull(),
    reps: integer("reps").notNull(),
    rpe: integer("rpe"), // Rating of Perceived Exertion (1-10)
    restSeconds: integer("restSeconds").default(90),
    notes: text("notes"),
    trainingSessionId: text("trainingSessionId").notNull().references(() => trainingSession.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
    trainingSession: one(trainingSession, {
        fields: [exercise.trainingSessionId],
        references: [trainingSession.id],
    }),
    workoutLogs: many(workoutLog),
}));

export type Exercise = InferSelectModel<typeof exercise>;

export const createExerciseSchema = createInsertSchema(exercise);
export const updateExerciseSchema = createExerciseSchema.partial();