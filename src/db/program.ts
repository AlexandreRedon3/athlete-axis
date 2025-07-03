import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { User } from "better-auth";

export const program = pgTable("program", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description").notNull(),
    level: text("level").$type<"Débutant" | "Intermédiaire" | "Avancé">().notNull(),
    type: text("type").$type<"Cardio" | "Hypertrophie" | "Force" | "Endurance" | "Mixte">().notNull(),
    durationWeeks: integer("durationWeeks").notNull(),
    sessionsPerWeek: integer("sessionsPerWeek").notNull(),
    status: text("status").$type<"draft" | "published">().default("draft"),
    imageUrl: text("imageUrl"),
    coachId: text("coachId").notNull().references(() => user.id),
    userId: text("userId").notNull().references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
})

export const programRelations = relations(program, ({ one }) => ({
    coach: one(user, {
        fields: [program.coachId],
        references: [user.id],
    }),
}));

export type Program = InferSelectModel<typeof program> & {
    user: User[];
};

export const createProgramSchema = createInsertSchema(program);
