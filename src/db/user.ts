import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Member } from "./member";
import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Account } from "better-auth";
import { Program } from "./program";


export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    twoFactorEnabled: boolean("twoFactorEnabled"),
    isCoach: boolean("isCoach").notNull(),
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
