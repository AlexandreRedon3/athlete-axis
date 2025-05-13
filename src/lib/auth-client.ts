// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { safeConfig } from "./env";

export const authClient = createAuthClient({
  baseURL: safeConfig.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    twoFactorClient(),
    inferAdditionalFields({
      user: {
        stripeId: { type: "string", defaultValue: "" },
        isPro: { type: "boolean", defaultValue: false, required: false },
        onBoardingComplete: { type: "boolean", defaultValue: false, required: false },
        address: { type: "string", defaultValue: "", required: false },
        zipCode: { type: "string", defaultValue: "", required: false },
        country: { type: "string", defaultValue: "", required: false },
        city: { type: "string", defaultValue: "", required: false },
        phoneNumber: { type: "string", defaultValue: "", required: false },
        smsNotifications: { type: "boolean", defaultValue: false, required: false },
        emailNotifications: { type: "boolean", defaultValue: false, required: false },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  verifyEmail,
  getSession,
  sendVerificationEmail,
  linkSocial,
  deleteUser,
  updateUser,
  forgetPassword,
  twoFactor,
} = authClient;
