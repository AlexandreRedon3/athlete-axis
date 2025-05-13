// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { safeConfig } from "./env";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../lib/db";
import { user as dbUsers } from "../db";
import { account, memberSchema } from "../db";
import { verification } from "@/db/verification";
import { twoFactor as twoFactorSchema } from "@/db/twoFactor";
import { session } from "@/db/session";
import { stripe } from "./stripe";
import { eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { twoFactor } from "better-auth/plugins/two-factor";

export const auth = betterAuth({
  appName: "Athlete-Axis",
  secret: safeConfig.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: dbUsers,
      accounts: account,
      member: memberSchema,
      verifications: verification,
      twoFactors: twoFactorSchema,
      sessions: session,
      members: memberSchema,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: safeConfig.GOOGLE_CLIENT_ID as string,
      clientSecret: safeConfig.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      image: { type: "string", defaultValue: "", required: false },
      isCoach: { type: "boolean", defaultValue: false, required: false },
      onBoardingComplete: { type: "boolean", defaultValue: false, required: false },
      stripeId: { type: "string", defaultValue: "", required: false },
      address: { type: "string", defaultValue: "", required: false },
      zipCode: { type: "string", defaultValue: "", required: false },
      country: { type: "string", defaultValue: "", required: false },
      city: { type: "string", defaultValue: "", required: false },
      phoneNumber: { type: "string", defaultValue: "", required: false },
      smsNotifications: { type: "boolean", defaultValue: false, required: false },
      emailNotifications: { type: "boolean", defaultValue: false, required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
          });

          await db.update(dbUsers).set({
            stripeId: customer.id,
          }).where(eq(dbUsers.id, user.id));
        },
      },
      update: {
        after: async (user) => {
          await db.update(dbUsers).set({
            updatedAt: new Date(),
          }).where(eq(dbUsers.id, user.id));
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    username(),
    twoFactor(),
  ],
});

export type BaseUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = typeof auth.$Infer.Session;
export type User = BaseUser & typeof auth.$Infer.Session.user;
