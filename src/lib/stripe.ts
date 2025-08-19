import Stripe from "stripe";

// If STRIPE_SECRET_KEY is not available, provide a dummy key for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Create a conditional Stripe instance that checks if we have an API key
let stripeInstance: Stripe | null = null;

if (stripeSecretKey) {
  stripeInstance = new Stripe(stripeSecretKey, {
    apiVersion: "2025-07-30.basil", // Match the original API version
    appInfo: {
      name: "Athlete-Axis",
      version: "0.1.0",
    },
  });
} else {
  console.warn("No Stripe secret key found. Stripe functionality will be limited.");
}

// Export a safe version of Stripe that won't throw errors when key is missing
export const stripe = stripeInstance || {
  products: {
    retrieve: async () => ({ name: "Test Product" }),
  },
  // Add other commonly used Stripe methods as needed
  customers: {
    create: async () => ({ id: "dummy_customer" }),
    retrieve: async () => ({ id: "dummy_customer" }),
  },
  subscriptions: {
    create: async () => ({ id: "dummy_subscription" }),
    retrieve: async () => ({ id: "dummy_subscription" }),
  },
} as unknown as Stripe;