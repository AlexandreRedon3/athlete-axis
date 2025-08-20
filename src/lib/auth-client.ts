// src/lib/auth-client.ts
import {
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import React from "react";

import { safeConfig } from "./env";

export const authClient = createAuthClient({
  baseURL: safeConfig.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    twoFactorClient(),
    inferAdditionalFields({
      user: {
        stripeId: { type: "string", defaultValue: "" },
        isCoach: { type: "boolean", defaultValue: false, required: false },
        onBoardingComplete: { type: "boolean", defaultValue: false, required: false },
        address: { type: "string", defaultValue: "", required: false },
        zipCode: { type: "string", defaultValue: "", required: false },
        country: { type: "string", defaultValue: "", required: false },
        city: { type: "string", defaultValue: "", required: false },
        phoneNumber: { type: "string", defaultValue: "", required: false },
        smsNotifications: { type: "boolean", defaultValue: false, required: false },
        emailNotifications: { type: "boolean", defaultValue: false, required: false },
        bio: { type: "string", defaultValue: "", required: false },
      },
    }),
  ],
});

// Hook personnalisé pour gérer les redirections après authentification
export const useAuthRedirect = () => {
  const { data: session, isPending } = authClient.useSession();
  
  React.useEffect(() => {
    if (!isPending && session?.user) {
      console.log("🔄 Redirection automatique - Utilisateur:", session.user.email, "isCoach:", session.user.isCoach);
      // Rediriger selon le type d'utilisateur
      if (session.user.isCoach) {
        window.location.href = `/dashboard/pro/${session.user.id}`;
      } else {
        window.location.href = `/dashboard/client/${session.user.id}`;
      }
    }
  }, [session, isPending]);
};

// Fonction utilitaire pour rediriger après connexion
export const redirectAfterAuth = (user: any) => {
  if (user?.isCoach) {
    window.location.href = `/dashboard/pro/${user.id}`;
  } else {
    window.location.href = `/dashboard/client/${user.id}`;
  }
};

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  verifyEmail,
  getSession,
  sendVerificationEmail,
  deleteUser,
  updateUser,
  forgetPassword,
  twoFactor,
} = authClient;
