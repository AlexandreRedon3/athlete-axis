ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "providerId";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "accountId" text NOT NULL;