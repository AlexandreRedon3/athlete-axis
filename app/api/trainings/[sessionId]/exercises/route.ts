// app/api/sessions/[sessionId]/exercises/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { exercise, trainingSession } from "@/db";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

const createExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().min(1).max(10),
  reps: z.number().min(1).max(50),
  rpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().min(0).max(600).optional(),
  notes: z.string().optional(),
  order: z.number().min(1),
});

// POST /api/sessions/:sessionId/exercises - Ajouter un exercice
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que la session existe et appartient au coach
    const trainingSessionData = await db.query.trainingSession.findFirst({
      where: eq(trainingSession.id, sessionId),
      with: {
        program: true,
      },
    });

    if (!trainingSessionData || trainingSessionData.program.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createExerciseSchema.parse(body);

    const newExercise = await db.insert(exercise).values({
      id: crypto.randomUUID(),
      ...validatedData,
      trainingSessionId: sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({ exercise: newExercise[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur POST /api/sessions/:id/exercises:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// GET /api/sessions/:sessionId/exercises - Liste des exercices d'une session
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const exercises = await db.query.exercise.findMany({
      where: eq(exercise.trainingSessionId, sessionId),
      orderBy: (exercises, { asc }) => [asc(exercises.order)],
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Erreur GET /api/sessions/:id/exercises:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}