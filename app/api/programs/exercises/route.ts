import { and, eq, max } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { exercise, program, trainingSession } from '@/db';
import { auth } from '@/lib/auth';
import { db } from '@/lib/neon';
import { validateAddExerciseForm } from '@/lib/validations/exercise-schema';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();

    // Validation des données
    const validation = validateAddExerciseForm(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Données invalides', details: validation.errors }, { status: 400 });
    }

    const { programId, sessionId, exerciseType, name, libraryExerciseId, sets, reps, rpe, restSeconds, notes } = body;

    // Vérifier que le programme appartient au coach
    const programExists = await db
      .select()
      .from(program)
      .where(and(
        eq(program.id, programId),
        eq(program.coachId, session.user.id)
      ))
      .limit(1);

    if (programExists.length === 0) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    // Vérifier que la session d'entraînement existe
    const sessionExists = await db
      .select()
      .from(trainingSession)
      .where(and(
        eq(trainingSession.id, sessionId),
        eq(trainingSession.programId, programId)
      ))
      .limit(1);

    console.log("sessionExists", sessionExists);

    if (sessionExists.length === 0) {
      return NextResponse.json({ error: 'Session d\'entraînement non trouvée' }, { status: 404 });
    }

    // Déterminer l'ordre du nouvel exercice
    const maxOrderResult = await db
      .select({ maxOrder: max(exercise.order) })
      .from(exercise)
      .where(eq(exercise.trainingSessionId, sessionId));

    const nextOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

    // Déterminer le nom de l'exercice
    let exerciseName = name;
    if (exerciseType === 'library' && libraryExerciseId) {
      // Mapping simple pour les exercices de bibliothèque
      const libraryExercises = {
        '1': 'Développé couché',
        '2': 'Squat',
        '3': 'Tractions',
        '4': 'Pompes',
        '5': 'Développé militaire',
        '6': 'Soulevé de terre',
        '7': 'Dips',
        '8': 'Curl biceps',
        '9': 'Planche',
        '10': 'Burpees'
      };
      exerciseName = libraryExercises[libraryExerciseId as keyof typeof libraryExercises] || name;
    }

    // Créer l'exercice
    const newExercise = await db
      .insert(exercise)
      .values({
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        name: exerciseName,
        sets,
        reps,
        rpe: rpe || null,
        restSeconds: restSeconds || null,
        notes: notes || null,
        order: nextOrder,
        trainingSessionId: sessionId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json({
      success: true,
      exercise: newExercise[0],
      message: 'Exercice ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout de l\'exercice' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les exercices d'un programme
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');
    const sessionId = searchParams.get('sessionId');

    if (!programId) {
      return NextResponse.json({ error: 'programId requis' }, { status: 400 });
    }

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Construire la requête avec conditions
    const whereConditions = [eq(trainingSession.programId, programId)];
    
    if (sessionId) {
      whereConditions.push(eq(trainingSession.id, sessionId));
    }

    const exercisesData = await db
      .select({ exercise: exercise, session: trainingSession })
      .from(exercise)
      .innerJoin(trainingSession, eq(exercise.trainingSessionId, trainingSession.id))
      .where(and(...whereConditions))
      .orderBy(exercise.order);

    // Transformer pour retourner directement les exercices
    const exercises = exercisesData.map(item => ({
      id: item.exercise.id,
      name: item.exercise.name,
      sets: item.exercise.sets,
      reps: item.exercise.reps,
      rpe: item.exercise.rpe,
      restSeconds: item.exercise.restSeconds,
      notes: item.exercise.notes,
      order: item.exercise.order,
      trainingSessionId: item.exercise.trainingSessionId,
      createdAt: item.exercise.createdAt,
      updatedAt: item.exercise.updatedAt
    }));

    return NextResponse.json({
      success: true,
      exercises,
      count: exercises.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des exercices:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 