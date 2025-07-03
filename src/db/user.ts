import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const user = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").unique(),
    displayUsername: text("display_username").unique(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    isCoach: boolean("is_coach").notNull().default(false),
    onBoardingComplete: boolean("on_boarding_complete").notNull().default(false),
    stripeId: text("stripe_id"),
    address: text("address"),
    zipCode: text("zip_code"),
    city: text("city"),
    country: text("country"),
    phoneNumber: text("phone_number"),
    emailNotifications: boolean("email_notifications").notNull().default(false),
    smsNotifications: boolean("sms_notifications").notNull().default(false),
    password: text("password"),
    coachId: text("coach_id"),
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export const createUserSchema = createInsertSchema(user);
