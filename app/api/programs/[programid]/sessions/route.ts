// app/api/programs/[programId]/sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trainingSession, program } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

interface RouteParams {
  params: {
    programId: string;
  };
}

const createSessionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  order: z.number().min(1),
});

// POST /api/programs/:programId/sessions - Ajouter une session
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que le coach possède le programme
    const prog = await db.query.program.findFirst({
      where: eq(program.id, params.programId),
    });

    if (!prog || prog.coachId !== session.user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createSessionSchema.parse(body);

    const newSession = await db.insert(trainingSession).values({
      id: crypto.randomUUID(),
      name: validatedData.name,
      description: validatedData.description,
      order: validatedData.order,
      programId: params.programId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({ session: newSession[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur POST /api/programs/:id/sessions:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}