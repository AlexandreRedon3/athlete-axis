import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/user";
import { program } from "@/db/program";
import { coachClient } from "@/db/coach_client";
import { eq, and, gte, count } from "drizzle-orm";
import { auth } from "@/lib/auth";

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

    // Calculer les statistiques
    const [
      totalClients,
      activeClients,
      totalPrograms,
      publishedPrograms,
      recentClients,
      recentPrograms
    ] = await Promise.all([
      // Total des clients
      db
        .select({ count: count() })
        .from(coachClient)
        .where(eq(coachClient.coachId, coach.id)),

      // Clients actifs (avec onboarding completé)
      db
        .select({ count: count() })
        .from(user)
        .innerJoin(coachClient, eq(coachClient.clientId, user.id))
        .where(
          and(
            eq(coachClient.coachId, coach.id),
            eq(user.onBoardingComplete, true)
          )
        ),

      // Total des programmes
      db
        .select({ count: count() })
        .from(program)
        .where(eq(program.coachId, coach.id)),

      // Programmes publiés
      db
        .select({ count: count() })
        .from(program)
        .where(
          and(
            eq(program.coachId, coach.id),
            eq(program.status, "published")
          )
        ),

      // Nouveaux clients (30 derniers jours)
      db
        .select({ count: count() })
        .from(user)
        .innerJoin(coachClient, eq(coachClient.clientId, user.id))
        .where(
          and(
            eq(coachClient.coachId, coach.id),
            gte(user.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          )
        ),

      // Nouveaux programmes (30 derniers jours)
      db
        .select({ count: count() })
        .from(program)
        .where(
          and(
            eq(program.coachId, coach.id),
            gte(program.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          )
        ),
    ]);

    const stats = {
      totalClients: Number(totalClients[0]?.count || 0),
      activeClients: Number(activeClients[0]?.count || 0),
      totalPrograms: Number(totalPrograms[0]?.count || 0),
      publishedPrograms: Number(publishedPrograms[0]?.count || 0),
      newClientsThisMonth: Number(recentClients[0]?.count || 0),
      newProgramsThisMonth: Number(recentPrograms[0]?.count || 0),
      completionRate: totalClients[0]?.count ? 
        Math.round((Number(activeClients[0]?.count || 0) / Number(totalClients[0]?.count)) * 100) : 0,
      publishRate: totalPrograms[0]?.count ? 
        Math.round((Number(publishedPrograms[0]?.count || 0) / Number(totalPrograms[0]?.count)) * 100) : 0,
    };

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 