import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trainingSession, exercise } from '@/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// DELETE - Supprimer une session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const { id: programId, sessionId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Vérifier que le programme appartient au coach
    const programExists = await db
      .select()
      .from(trainingSession)
      .where(and(
        eq(trainingSession.id, sessionId),
        eq(trainingSession.programId, programId)
      ))
      .limit(1);

    if (programExists.length === 0) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    // Supprimer d'abord tous les exercices de la session
    await db
      .delete(exercise)
      .where(eq(exercise.trainingSessionId, sessionId));

    // Puis supprimer la session
    await db
      .delete(trainingSession)
      .where(eq(trainingSession.id, sessionId));

    return NextResponse.json({
      success: true,
      message: 'Session supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
}

// POST - Dupliquer une session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const { id: programId, sessionId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer la session à dupliquer
    const originalSession = await db
      .select()
      .from(trainingSession)
      .where(eq(trainingSession.id, sessionId))
      .limit(1);

    if (originalSession.length === 0) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    const sessionToDuplicate = originalSession[0];

    // Récupérer tous les exercices de la session
    const sessionExercises = await db
      .select()
      .from(exercise)
      .where(eq(exercise.trainingSessionId, sessionId))
      .orderBy(exercise.order);

    // Créer une nouvelle session (copie)
    const newSessionId = crypto.randomUUID();
    const newSession = await db
      .insert(trainingSession)
      .values({
        id: newSessionId,
        name: `${sessionToDuplicate.name} (Copie)`,
        programId: programId,
        order: sessionToDuplicate.order + 1, // Incrémenter l'ordre
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Dupliquer tous les exercices
    if (sessionExercises.length > 0) {
      const exercisesToInsert = sessionExercises.map(ex => ({
        id: crypto.randomUUID(),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rpe: ex.rpe,
        restSeconds: ex.restSeconds,
        notes: ex.notes,
        order: ex.order,
        trainingSessionId: newSessionId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await db.insert(exercise).values(exercisesToInsert);
    }

    return NextResponse.json({
      success: true,
      session: newSession[0],
      message: 'Session dupliquée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la duplication de la session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la duplication' },
      { status: 500 }
    );
  }
} 