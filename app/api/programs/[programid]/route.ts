// app/api/programs/[programId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { program, programAssignment } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

interface RouteParams {
  params: {
    programId: string;
  };
}

// Schéma de validation pour la mise à jour
const updateProgramSchema = z.object({
  name: z.string().min(1).optional(),
  durationWeeks: z.number().min(1).max(52).optional(),
  sessionsPerWeek: z.number().min(1).max(7).optional(),
});

// GET /api/programs/:programId - Détail d'un programme
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const programData = await db.query.program.findFirst({
      where: eq(program.id, params.programId),
      with: {
        trainingSessions: {
          orderBy: (sessions, { asc }) => [asc(sessions.order)],
          with: {
            exercises: {
              orderBy: (exercises, { asc }) => [asc(exercises.order)],
            },
          },
        },
        coach: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!programData) {
      return NextResponse.json(
        { error: "Programme non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    const hasAccess = await checkProgramAccess(
      session.user.id,
      params.programId,
      session.user.isCoach ?? false
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    return NextResponse.json({ program: programData });
  } catch (error) {
    console.error("Erreur GET /api/programs/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/programs/:programId - Modifier un programme
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProgramSchema.parse(body);
    
    // Vérifier que le coach est propriétaire
    const existingProgram = await db.query.program.findFirst({
      where: eq(program.id, params.programId),
    });

    if (!existingProgram || existingProgram.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const updated = await db
      .update(program)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(program.id, params.programId))
      .returning();

    return NextResponse.json({ program: updated[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur PUT /api/programs/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/programs/:programId
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier propriété
    const existingProgram = await db.query.program.findFirst({
      where: eq(program.id, params.programId),
    });

    if (!existingProgram || existingProgram.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // La suppression en cascade devrait être gérée par la DB
    await db.delete(program).where(eq(program.id, params.programId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/programs/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Fonction helper pour vérifier l'accès
async function checkProgramAccess(
  userId: string,
  programId: string,
  isCoach: boolean
): Promise<boolean> {
  if (isCoach) {
    const prog = await db.query.program.findFirst({
      where: and(
        eq(program.id, programId),
        eq(program.coachId, userId)
      ),
    });
    return !!prog;
  } else {
    const assignment = await db.query.programAssignment.findFirst({
      where: and(
        eq(programAssignment.programId, programId),
        eq(programAssignment.athleteId, userId),
        eq(programAssignment.isActive, true)
      ),
    });
    return !!assignment;
  }
}