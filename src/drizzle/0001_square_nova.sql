CREATE TABLE "coach_client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" text NOT NULL,
	"client_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "member" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "coachId" text;--> statement-breakpoint
ALTER TABLE "coach_client" ADD CONSTRAINT "coach_client_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_client" ADD CONSTRAINT "coach_client_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;