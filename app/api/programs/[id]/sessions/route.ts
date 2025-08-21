import { count, eq, max } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { exercise, program,trainingSession } from '@/db';
import { auth } from '@/lib/auth';
import { db } from '@/lib/neon';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;
    console.log('GET /api/programs/[id]/sessions - programId:', programId);
    
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      console.log('Accès refusé - utilisateur non coach');
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    
    // Récupérer les sessions avec le nombre d'exercices
    const sessions = await db
      .select({ session: trainingSession, exerciseCount: count(exercise.id) })
      .from(trainingSession)
      .leftJoin(exercise, eq(exercise.trainingSessionId, trainingSession.id))
      .where(eq(trainingSession.programId, programId))
      .groupBy(trainingSession.id)
      .orderBy(trainingSession.order);

    console.log('Sessions trouvées:', sessions.length);

    const mappedSessions = sessions.map(s => ({
      ...s.session,
      exerciseCount: s.exerciseCount,
      weekNumber: 1, // Default value as not in schema
      dayNumber: s.session.order, // Using order as dayNumber
      type: 'Push', // Default value
      targetRPE: 7, // Default value
      duration: 60, // Default value
      exercises: [], // Will be populated by the hook
      name: s.session.name || `Session ${s.session.order}` // Ensure name is set
    }));

    console.log('Sessions mappées:', mappedSessions);

    return NextResponse.json({ 
      success: true, 
      sessions: mappedSessions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id: programId } = await params;
    const body = await request.json();
    
    const { name, weekNumber, dayNumber, type, targetRPE, duration, notes } = body;

    // Validation des données
    if (!name || !weekNumber || !dayNumber || !type || !targetRPE || !duration) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier que le programme appartient au coach
    const programExists = await db
      .select()
      .from(program)
      .where(eq(program.id, programId))
      .limit(1);

    if (programExists.length === 0) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    // Déterminer l'ordre de la nouvelle session
    const maxOrderResult = await db
      .select({ maxOrder: max(trainingSession.order) })
      .from(trainingSession)
      .where(eq(trainingSession.programId, programId));

    const nextOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

    // Créer la session
    const newSession = await db
      .insert(trainingSession)
      .values({
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        name,
        order: nextOrder,
        programId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      session: {
        ...newSession[0],
        weekNumber,
        dayNumber,
        type,
        targetRPE,
        duration,
        notes,
        exerciseCount: 0
      },
      message: 'Session créée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la session' },
      { status: 500 }
    );
  }
} 