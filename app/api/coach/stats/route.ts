import { and, count,eq, gte, lte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { 
  coachClient, 
  exercise,
  program, 
  trainingSession 
} from '@/db';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const coachId = session.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Total des clients
    const totalClientsResult = await db
      .select({ count: count() })
      .from(coachClient)
      .where(eq(coachClient.coachId, coachId));

    const totalClients = totalClientsResult[0]?.count || 0;

    // 2. Clients actifs (tous les clients pour l'instant)
    const activeClients = totalClients;

    // 3. Nouveaux clients ce mois
    const newClientsThisMonthResult = await db
      .select({ count: count() })
      .from(coachClient)
      .where(and(
        eq(coachClient.coachId, coachId),
        gte(coachClient.createdAt, startOfMonth)
      ));

    const newClientsThisMonth = newClientsThisMonthResult[0]?.count || 0;

    // 4. Programmes publiés
    const publishedProgramsResult = await db
      .select({ count: count() })
      .from(program)
      .where(and(
        eq(program.coachId, coachId),
        eq(program.status, 'published')
      ));

    const publishedPrograms = publishedProgramsResult[0]?.count || 0;

    // 5. Total des programmes
    const totalProgramsResult = await db
      .select({ count: count() })
      .from(program)
      .where(eq(program.coachId, coachId));

    const totalPrograms = totalProgramsResult[0]?.count || 0;

    // 6. Nouveaux programmes ce mois
    const newProgramsThisMonthResult = await db
      .select({ count: count() })
      .from(program)
      .where(and(
        eq(program.coachId, coachId),
        gte(program.createdAt, startOfMonth)
      ));

    const newProgramsThisMonth = newProgramsThisMonthResult[0]?.count || 0;

    // 7. Sessions totales
    const totalSessionsResult = await db
      .select({ count: count() })
      .from(trainingSession)
      .innerJoin(program, eq(trainingSession.programId, program.id))
      .where(eq(program.coachId, coachId));

    const totalSessions = totalSessionsResult[0]?.count || 0;

    // 8. Sessions ce mois
    const sessionsThisMonthResult = await db
      .select({ count: count() })
      .from(trainingSession)
      .innerJoin(program, eq(trainingSession.programId, program.id))
      .where(and(
        eq(program.coachId, coachId),
        gte(trainingSession.createdAt, startOfMonth)
      ));

    const sessionsThisMonth = sessionsThisMonthResult[0]?.count || 0;

    // 9. Exercices total
    const totalExercisesResult = await db
      .select({ count: count() })
      .from(exercise)
      .innerJoin(trainingSession, eq(exercise.trainingSessionId, trainingSession.id))
      .innerJoin(program, eq(trainingSession.programId, program.id))
      .where(eq(program.coachId, coachId));

    const totalExercises = totalExercisesResult[0]?.count || 0;

    // 10. Taux de complétion (simulé pour l'instant)
    const completionRate = 85; // Valeur par défaut

    // 11. Taux de publication (programmes publiés / total)
    const publishRate = totalPrograms > 0 ? Math.round((publishedPrograms / totalPrograms) * 100) : 0;

    // 12. Données pour les graphiques (derniers 4 mois)
    const monthlyData = [];
    for (let i = 3; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // Clients actifs ce mois
      const activeClientsMonthResult = await db
        .select({ count: count() })
        .from(coachClient)
        .where(and(
          eq(coachClient.coachId, coachId),
          lte(coachClient.createdAt, monthEnd)
        ));

      // Programmes publiés ce mois
      const publishedProgramsMonthResult = await db
        .select({ count: count() })
        .from(program)
        .where(and(
          eq(program.coachId, coachId),
          eq(program.status, 'published'),
          lte(program.createdAt, monthEnd)
        ));

      // Sessions ce mois
      const sessionsMonthResult = await db
        .select({ count: count() })
        .from(trainingSession)
        .innerJoin(program, eq(trainingSession.programId, program.id))
        .where(and(
          eq(program.coachId, coachId),
          gte(trainingSession.createdAt, monthStart),
          lte(trainingSession.createdAt, monthEnd)
        ));

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      
      monthlyData.push({
        month: monthNames[monthStart.getMonth()],
        clients: activeClientsMonthResult[0]?.count || 0,
        programs: publishedProgramsMonthResult[0]?.count || 0,
        sessions: sessionsMonthResult[0]?.count || 0
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalClients,
        activeClients,
        newClientsThisMonth,
        totalPrograms,
        publishedPrograms,
        newProgramsThisMonth,
        totalSessions,
        sessionsThisMonth,
        totalExercises,
        completionRate,
        publishRate,
        monthlyData
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 