import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Member } from "./member";
import { InferSelectModel, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Account } from "better-auth";
import { Program } from "./program";


export const user = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").unique(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull().default(sql`now()`),
    updatedAt: timestamp("updatedAt").notNull().default(sql`now()`),
    twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),
    isCoach: boolean("isCoach").notNull().default(false),
    onBoardingComplete: boolean("onBoardingComplete").notNull().default(false),
    stripeId: text("stripeId"),
    address: text("address"),
    zipCode: text("zipCode"),
    city: text("city"),
    country: text("country"),
    lang: text("lang").default("fr"),
    phoneNumber: text("phoneNumber"),
    emailNotifications: boolean("emailNotifications").notNull().default(false),
    smsNotifications: boolean("smsNotifications").notNull().default(false),
});

export type User = InferSelectModel<typeof user> & {
    memberships: Member[];
    accounts: Account[];
    programs: Program[];
};

export const createUserSchema = createInsertSchema(user);
