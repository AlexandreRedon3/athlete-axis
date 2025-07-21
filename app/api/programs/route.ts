// app/api/programs/route.ts
import { db } from "@/lib/db"
import { program } from "@/db/program"
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-client"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { and, eq } from "drizzle-orm/sql"
import { programAssignment } from "@/db/program-assignment"

// Schéma de validation pour créer un programme
const createProgramSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  durationWeeks: z.number().min(1).max(52),
  sessionsPerWeek: z.number().min(1).max(7),
  type: z.enum(["Cardio", "Hypertrophie", "Force", "Endurance", "Mixte"]),
  description: z.string().min(1, "La description est requise"),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"]),
  imageUrl: z.string().optional(),
});

interface RouteParams {
  params: {
    programId: string
  }
}

// GET /api/programs - Liste des programmes
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let programs;
    
    if (session.user.isCoach) {
      // Coach voit ses programmes créés
      programs = await db.query.program.findMany({
        where: eq(program.coachId, session.user.id),
        with: {
          trainingSessions: {
            orderBy: (sessions, { asc }) => [asc(sessions.order)],
          },
        },
      });
    } else {
      // Athlète voit ses programmes assignés actifs
      const assignments = await db.query.programAssignment.findMany({
        where: and(
          eq(programAssignment.athleteId, session.user.id),
          eq(programAssignment.isActive, true)
        ),
        with: {
          program: {
            with: {
              trainingSessions: {
                orderBy: (sessions, { asc }) => [asc(sessions.order)],
              },
            },
          },
        },
      });
      
      programs = assignments.map(a => a.program);
    }

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Erreur GET /api/programs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/programs - Créer un programme (coach only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user.isCoach) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createProgramSchema.parse(body);

    const newProgram = await db.insert(program).values({
      id: crypto.randomUUID(),
      name: validatedData.name,
      durationWeeks: validatedData.durationWeeks,
      sessionsPerWeek: validatedData.sessionsPerWeek,
      coachId: session.user.id,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: validatedData.type,
      description: validatedData.description,
      level: validatedData.level,
      imageUrl: validatedData.imageUrl,
    }).returning();

    return NextResponse.json({ program: newProgram[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Erreur POST /api/programs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

