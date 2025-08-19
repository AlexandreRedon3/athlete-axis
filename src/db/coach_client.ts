import { relations, sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { user } from "./user"

export const coachClient = pgTable("coach_client", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: text("coach_id").notNull().references(() => user.id),
  clientId: text("client_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const coachClientRelations = relations(coachClient, ({ one }) => ({
  coach: one(user, {
    fields: [coachClient.coachId],
    references: [user.id],
    relationName: "coach",
  }),
  client: one(user, {
    fields: [coachClient.clientId],
    references: [user.id],
    relationName: "client",
  }),
})) 