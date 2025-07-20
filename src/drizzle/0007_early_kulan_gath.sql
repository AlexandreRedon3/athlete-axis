CREATE TABLE "exercise" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sets" integer NOT NULL,
	"reps" integer NOT NULL,
	"rpe" integer,
	"restSeconds" integer DEFAULT 90,
	"notes" text,
	"trainingSessionId" text NOT NULL,
	"order" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exerciseLibrary" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"primaryMuscles" text[] NOT NULL,
	"secondaryMuscles" text[],
	"equipment" text,
	"instructions" text,
	"videoUrl" text,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exerciseLibrary_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "trainingSession" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"programId" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workoutLog" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"exerciseId" text NOT NULL,
	"setsCompleted" integer NOT NULL,
	"repsCompleted" integer NOT NULL,
	"weight" real,
	"rpe" integer,
	"notes" text,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programAssignment" (
	"id" text PRIMARY KEY NOT NULL,
	"programId" text NOT NULL,
	"athleteId" text NOT NULL,
	"coachId" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_trainingSessionId_trainingSession_id_fk" FOREIGN KEY ("trainingSessionId") REFERENCES "public"."trainingSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainingSession" ADD CONSTRAINT "trainingSession_programId_program_id_fk" FOREIGN KEY ("programId") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutLog" ADD CONSTRAINT "workoutLog_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutLog" ADD CONSTRAINT "workoutLog_exerciseId_exercise_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programAssignment" ADD CONSTRAINT "programAssignment_programId_program_id_fk" FOREIGN KEY ("programId") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programAssignment" ADD CONSTRAINT "programAssignment_athleteId_users_id_fk" FOREIGN KEY ("athleteId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programAssignment" ADD CONSTRAINT "programAssignment_coachId_users_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;