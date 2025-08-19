import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { program } from "@/db/program";
import { user } from "@/db/user";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer le coach connecté
    const coach = await db.query.user.findFirst({
      where: eq(user.email, session.user.email),
    });

    if (!coach || !coach.isCoach) {
      return NextResponse.json(
        { error: "Accès réservé aux coaches" },
        { status: 403 }
      );
    }

    // Récupérer tous les programmes du coach
    const programs = await db
      .select({
        id: program.id,
        name: program.name,
        description: program.description,
        level: program.level,
        type: program.type,
        durationWeeks: program.durationWeeks,
        sessionsPerWeek: program.sessionsPerWeek,
        status: program.status,
        imageUrl: program.imageUrl,
        coachId: program.coachId,
        userId: program.userId,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
      })
      .from(program)
      .where(eq(program.coachId, coach.id));

    return NextResponse.json({
      success: true,
      programs,
      total: programs.length,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des programmes:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 