// app/api/sessions/reorder/route.ts
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { program,trainingSession } from "@/db";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const reorderSchema = z.object({
  programId: z.string(),
  sessions: z.array(
    z.object({
      id: z.string(),
      order: z.number().min(1),
    })
  ),
});

// PATCH /api/sessions/reorder - Réorganiser les sessions
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = reorderSchema.parse(body);

    // Vérifier que le coach possède le programme
    const prog = await db.query.program.findFirst({
      where: eq(program.id, validatedData.programId),
    });

    if (!prog || prog.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Mettre à jour l'ordre de chaque session dans une transaction
    await db.transaction(async (tx) => {
      for (const sessionUpdate of validatedData.sessions) {
        await tx
          .update(trainingSession)
          .set({ 
            order: sessionUpdate.order,
            updatedAt: new Date(),
          })
          .where(eq(trainingSession.id, sessionUpdate.id));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur PATCH /api/sessions/reorder:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}