import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { User } from "better-auth";

export const program = pgTable("program", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    durationWeeks: integer("durationWeeks").notNull(),
    sessionsPerWeek: integer("sessionsPerWeek").notNull(),
    coachId: text("coachId").notNull().references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    userId: text("userId").notNull().references(() => user.id),
});

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
