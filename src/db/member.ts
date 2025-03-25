import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { User, user } from "./user";

export const member = pgTable("member", {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id),
    role: text("role").notNull(),
    createdAt: timestamp("createdAt").notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
}));

export type Member = InferSelectModel<typeof member> & {
    user: User;
};

export const memberSchema = createSelectSchema(member);
export const createMemberSchema = createInsertSchema(member);
