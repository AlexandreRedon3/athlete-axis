ALTER TABLE "users" DROP CONSTRAINT "users_displayedUsername_unique";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_coach" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "on_boarding_complete" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_notifications" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sms_notifications" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "coach_id" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "providerId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "accountId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "accessToken";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refreshToken";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "idToken";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refreshTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "displayedUsername";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "emailVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "twoFactorEnabled";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isCoach";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "onBoardingComplete";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "stripeId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "zipCode";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "lang";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phoneNumber";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "emailNotifications";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "smsNotifications";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "coachId";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_display_username_unique" UNIQUE("display_username");