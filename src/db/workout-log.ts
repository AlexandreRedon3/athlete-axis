import { pgTable, text, integer, timestamp, real } from "drizzle-orm/pg-core";
import { user } from "./user";
import { exercise } from "./exercice";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const workoutLog = pgTable("workoutLog", {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id),
    exerciseId: text("exerciseId").notNull().references(() => exercise.id),
    setsCompleted: integer("setsCompleted").notNull(),
    repsCompleted: integer("repsCompleted").notNull(),
    weight: real("weight"), // en kg
    rpe: integer("rpe"), // 1-10
    notes: text("notes"),
    completedAt: timestamp("completedAt").notNull().defaultNow(),
});

export const workoutLogRelations = relations(workoutLog, ({ one }) => ({
    user: one(user, {
        fields: [workoutLog.userId],
        references: [user.id],
    }),
    exercise: one(exercise, {
        fields: [workoutLog.exerciseId],
        references: [exercise.id],
    }),
}));

export type WorkoutLog = InferSelectModel<typeof workoutLog>;

export const createWorkoutLogSchema = createInsertSchema(workoutLog);