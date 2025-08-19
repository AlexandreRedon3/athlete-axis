import { and, eq, gte, lte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { 
  program,
  trainingSession} from '@/db';
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
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Récupérer les sessions du jour (sans les clients pour l'instant)
    const todaySessions = await db
      .select({
        id: trainingSession.id,
        name: trainingSession.name,
        programName: program.name,
        createdAt: trainingSession.createdAt,
        order: trainingSession.order
      })
      .from(trainingSession)
      .innerJoin(program, eq(trainingSession.programId, program.id))
      .where(and(
        eq(program.coachId, coachId),
        gte(trainingSession.createdAt, startOfDay),
        lte(trainingSession.createdAt, endOfDay)
      ))
      .orderBy(trainingSession.order);

    // Transformer les données pour correspondre à l'interface attendue
    const formattedSessions = todaySessions.map((session, index) => ({
      id: session.id,
      client: `Client ${index + 1}`, // Client simulé pour l'instant
      type: session.name,
      time: `${9 + index}:00`, // Heure simulée basée sur l'index
      status: 'upcoming' as const,
      programName: session.programName
    }));

    return NextResponse.json({
      success: true,
      sessions: formattedSessions
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des sessions du jour:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des sessions' },
      { status: 500 }
    );
  }
} 