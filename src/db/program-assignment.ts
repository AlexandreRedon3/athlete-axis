import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./user";
import { program } from "./program";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const programAssignment = pgTable("programAssignment", {
    id: text("id").primaryKey(),
    programId: text("programId").notNull().references(() => program.id, { onDelete: "cascade" }),
    athleteId: text("athleteId").notNull().references(() => user.id),
    coachId: text("coachId").notNull().references(() => user.id),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate"),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const programAssignmentRelations = relations(programAssignment, ({ one }) => ({
    program: one(program, {
        fields: [programAssignment.programId],
        references: [program.id],
    }),
    athlete: one(user, {
        fields: [programAssignment.athleteId],
        references: [user.id],
    }),
    coach: one(user, {
        fields: [programAssignment.coachId],
        references: [user.id],
    }),
}));

export type ProgramAssignment = InferSelectModel<typeof programAssignment>;

export const createProgramAssignmentSchema = createInsertSchema(programAssignment);