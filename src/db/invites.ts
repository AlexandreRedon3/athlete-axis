import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { user } from "./user"

export const invites = pgTable("invites", {
  id: text("id").primaryKey(),
  token: text("token").notNull(),
  coachId: text("coach_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
}) 

export const inviteRelations = relations(invites, ({ one }) => ({
  coach: one(user, {
    fields: [invites.coachId],
    references: [user.id],
  }),
}))

