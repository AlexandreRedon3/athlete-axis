import { createAccessControl } from "better-auth/plugins/access";
import { betterAuth } from "better-auth";
import { safeConfig } from "./env";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../lib/db";
import { user as dbUsers} from "../db"
import { account, memberSchema } from "../db";
import { verification } from "@/db/verification";
import { twoFactor as twoFactorSchema } from "@/db/twoFactor";
import { session } from "@/db/session";
import { stripe } from "./stripe";
import { eq } from "drizzle-orm";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { twoFactor } from "better-auth/plugins/two-factor";

const statement = {
    project: ["create", "share", "update", "delete"],
  } as const;
  
export const ac = createAccessControl(statement);

export const member = ac.newRole({
project: ["create"],
});

export const admin = ac.newRole({
project: ["create", "share", "update"],
});

export const owner = ac.newRole({
project: ["create", "share", "update", "delete"],
});

export type BaseUser = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type BaseMember = {
    id: string;
    email: string;
    role: string;
}

export const auth = betterAuth({
    appName: "Athlete-Axis",
    secret: safeConfig.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: dbUsers,
            account: account,
            member: member,
            verification: verification,
            twoFactor: twoFactorSchema,
            session: session,
            members: memberSchema,
        },
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            image: {
                type: "string",
                required: false,
                defaultValue: "",
            },
            isCoach: {
                type: "boolean",
                defaultValue: false,
                required: false,
            },
            onBoardingComplete: {
                type: "boolean",
                defaultValue: false,
                required: false,
            },
            stripeId: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            address: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            zipCode: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            country: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            city: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            phoneNumber: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            smsNotifications: {
                type: "boolean",
                defaultValue: false,
                required: false,
            },
            emailNotifications: {
                type: "boolean",
                defaultValue: false,
                required: false,
            },

        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const username = user.name;
                    const email = user.email;

                const customer = await stripe.customers.create({
                    email: email,
                    name: username,
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

export type User = BaseUser & typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
