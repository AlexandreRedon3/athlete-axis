// app/api/exercises/[exerciseId]/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { exercise } from "@/db";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: {
    exerciseId: string;
  };
}

const updateExerciseSchema = z.object({
  name: z.string().min(1).optional(),
  sets: z.number().min(1).max(10).optional(),
  reps: z.number().min(1).max(50).optional(),
  rpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().min(0).max(600).optional(),
  notes: z.string().optional(),
  order: z.number().min(1).optional(),
});

// PUT /api/exercises/:exerciseId - Modifier un exercice
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'exercice appartient au coach
    const exerciseData = await db.query.exercise.findFirst({
      where: eq(exercise.id, params.exerciseId),
      with: {
        trainingSession: {
          with: {
            program: true,
          },
        },
      },
    });

    if (!exerciseData || exerciseData.trainingSession.program.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateExerciseSchema.parse(body);

    const updated = await db
      .update(exercise)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(exercise.id, params.exerciseId))
      .returning();

    return NextResponse.json({ exercise: updated[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur PUT /api/exercises/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/exercises/:exerciseId - Supprimer un exercice
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier permissions
    const exerciseData = await db.query.exercise.findFirst({
      where: eq(exercise.id, params.exerciseId),
      with: {
        trainingSession: {
          with: {
            program: true,
          },
        },
      },
    });

    if (!exerciseData || exerciseData.trainingSession.program.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    await db.delete(exercise).where(eq(exercise.id, params.exerciseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/exercises/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}