// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { safeConfig } from "./env";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../lib/db";
import { user as dbUsers } from "../db";
import { account } from "../db";
import { verification } from "@/db/verification";
import { twoFactor as twoFactorSchema } from "@/db/twoFactor";
import { session } from "@/db/session";
import { stripe } from "./stripe";
import { eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { twoFactor } from "better-auth/plugins/two-factor";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  appName: "Athlete-Axis",
  secret: safeConfig.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: dbUsers,
      accounts: account,
      verifications: verification,
      twoFactors: twoFactorSchema,
      sessions: session,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash(password) {
        return bcrypt.hash(password, 12);
      },
      verify(data) {
        return bcrypt.compare(data.password, data.hash);
      },
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
