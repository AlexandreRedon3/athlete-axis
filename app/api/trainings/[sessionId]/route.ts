// app/api/sessions/[sessionId]/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { trainingSession } from "@/db";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

const updateSessionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().min(1).optional(),
});

// PUT /api/sessions/:sessionId - Modifier une session
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

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
    const validatedData = updateSessionSchema.parse(body);

    const updated = await db
      .update(trainingSession)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(trainingSession.id, sessionId))
      .returning();

    return NextResponse.json({ session: updated[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur PUT /api/sessions/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/:sessionId - Supprimer une session
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const trainingSessionData = await db.query.trainingSession.findFirst({
      where: eq(trainingSession.id, sessionId),
      with: {
        program: true,
      },
    });

    if (!trainingSessionData || trainingSessionData.program.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    await db.delete(trainingSession).where(eq(trainingSession.id, sessionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/sessions/:id:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}