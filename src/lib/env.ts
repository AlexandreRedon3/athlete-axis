import dotenv from 'dotenv';

dotenv.config();

interface ENV {
  DATABASE_URL: string | undefined;
  RESEND_API_KEY: string | undefined;
  TRIGGER_PUBLIC_API_KEY: string | undefined;
  TRIGGER_SECRET_KEY: string | undefined;
  NEXT_PUBLIC_APP_URL: string | undefined;
  NODE_ENV: string | undefined;
  NEXT_PUBLIC_POSTHOG_KEY: string | undefined;
  NEXT_PUBLIC_POSTHOG_HOST: string | undefined;
  STRIPE_SECRET_KEY: string | undefined;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string | undefined;
  BETTER_AUTH_SECRET: string | undefined;
  BETTER_AUTH_URL: string | undefined;
  UPLOADTHING_TOKEN: string | undefined;
  STRIPE_BASIC_PLAN_ID: string | undefined;
  STRIPE_PRO_PLAN_ID: string | undefined;
  STRIPE_ULTIMATE_PLAN_ID: string | undefined;
  STRIPE_WEBHOOK_BASIC_SECRET: string | undefined;
  STRIPE_WEBHOOK_PRO_SECRET: string | undefined;
  STRIPE_WEBHOOK_ULTIMATE_SECRET: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  NEXT_PUBLIC_BETTER_AUTH_URL: string | undefined;
}

interface Config {
  DATABASE_URL: string | undefined;
  RESEND_API_KEY: string | undefined;
  TRIGGER_PUBLIC_API_KEY: string | undefined;
  TRIGGER_SECRET_KEY: string | undefined;
  NEXT_PUBLIC_APP_URL: string | undefined;
  NODE_ENV: string | undefined;
  NEXT_PUBLIC_POSTHOG_KEY: string | undefined;
  NEXT_PUBLIC_POSTHOG_HOST: string | undefined;
  STRIPE_SECRET_KEY: string | undefined;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string | undefined;
  BETTER_AUTH_SECRET: string | undefined;
  BETTER_AUTH_URL: string | undefined;
  UPLOADTHING_TOKEN: string | undefined;
  STRIPE_BASIC_PLAN_ID: string | undefined;
  STRIPE_PRO_PLAN_ID: string | undefined;
  STRIPE_ULTIMATE_PLAN_ID: string | undefined;
  STRIPE_WEBHOOK_BASIC_SECRET: string | undefined;
  STRIPE_WEBHOOK_PRO_SECRET: string | undefined;
  STRIPE_WEBHOOK_ULTIMATE_SECRET: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  NEXT_PUBLIC_BETTER_AUTH_URL: string | undefined;
}

const getConfig = (): ENV => {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TRIGGER_PUBLIC_API_KEY: process.env.TRIGGER_PUBLIC_API_KEY,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    STRIPE_BASIC_PLAN_ID: process.env.STRIPE_BASIC_PLAN_ID,
    STRIPE_PRO_PLAN_ID: process.env.STRIPE_PRO_PLAN_ID,
    STRIPE_ULTIMATE_PLAN_ID: process.env.STRIPE_ULTIMATE_PLAN_ID,
    STRIPE_WEBHOOK_BASIC_SECRET: process.env.STRIPE_WEBHOOK_BASIC_SECRET,
    STRIPE_WEBHOOK_PRO_SECRET: process.env.STRIPE_WEBHOOK_PRO_SECRET,
    STRIPE_WEBHOOK_ULTIMATE_SECRET: process.env.STRIPE_WEBHOOK_ULTIMATE_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  };
};

const getSafeConfig = (config: ENV): Config => {
  // Pour le développement et la production, on accepte toutes les variables comme optionnelles
  // et on utilise des valeurs par défaut vides si elles ne sont pas définies
  const safeConfig = {} as Config;
  for (const [key, value] of Object.entries(config)) {
    (safeConfig as any)[key] = value || '';
  }
  return safeConfig;
};
const config = getConfig();

export const safeConfig = getSafeConfig(config);
