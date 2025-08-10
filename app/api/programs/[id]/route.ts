import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { program, trainingSession, exercise } from '@/db';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// PUT - Mettre à jour un programme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, type, level, durationWeeks, sessionsPerWeek } = body;

    // Vérifier que le programme appartient au coach
    const programExists = await db
      .select()
      .from(program)
      .where(eq(program.id, programId))
      .limit(1);

    if (programExists.length === 0) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    // Mettre à jour le programme
    const updatedProgram = await db
      .update(program)
      .set({
        name: name || programExists[0].name,
        description: description || programExists[0].description,
        type: type || programExists[0].type,
        level: level || programExists[0].level,
        durationWeeks: durationWeeks || programExists[0].durationWeeks,
        sessionsPerWeek: sessionsPerWeek || programExists[0].sessionsPerWeek,
        updatedAt: new Date()
      })
      .where(eq(program.id, programId))
      .returning();

    return NextResponse.json({
      success: true,
      program: updatedProgram[0],
      message: 'Programme mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un programme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
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

    // Récupérer toutes les sessions du programme
    const programSessions = await db
      .select()
      .from(trainingSession)
      .where(eq(trainingSession.programId, programId));

    // Supprimer tous les exercices de toutes les sessions
    for (const session of programSessions) {
      await db
        .delete(exercise)
        .where(eq(exercise.trainingSessionId, session.id));
    }

    // Supprimer toutes les sessions du programme
    await db
      .delete(trainingSession)
      .where(eq(trainingSession.programId, programId));

    // Supprimer le programme
    await db
      .delete(program)
      .where(eq(program.id, programId));

    return NextResponse.json({
      success: true,
      message: 'Programme supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
}

// POST - Dupliquer un programme
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.isCoach) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer le programme à dupliquer
    const originalProgram = await db
      .select()
      .from(program)
      .where(eq(program.id, programId))
      .limit(1);

    if (originalProgram.length === 0) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    const programToDuplicate = originalProgram[0];

    // Créer une nouvelle copie du programme
    const newProgramId = crypto.randomUUID();
    const newProgram = await db
      .insert(program)
      .values({
        id: newProgramId,
        name: `${programToDuplicate.name} (Copie)`,
        description: programToDuplicate.description,
        type: programToDuplicate.type,
        level: programToDuplicate.level,
        durationWeeks: programToDuplicate.durationWeeks,
        sessionsPerWeek: programToDuplicate.sessionsPerWeek,
        status: 'draft', // Nouveau programme en brouillon
        coachId: session.user.id,
        userId: session.user.id, // Ajouter le userId requis
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Récupérer toutes les sessions du programme original
    const originalSessions = await db
      .select()
      .from(trainingSession)
      .where(eq(trainingSession.programId, programId))
      .orderBy(trainingSession.order);

    // Dupliquer toutes les sessions et leurs exercices
    for (const originalSession of originalSessions) {
      // Créer une nouvelle session
      const newSessionId = crypto.randomUUID();
      await db
        .insert(trainingSession)
        .values({
          id: newSessionId,
          name: originalSession.name,
          programId: newProgramId,
          order: originalSession.order,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      // Récupérer et dupliquer tous les exercices de cette session
      const sessionExercises = await db
        .select()
        .from(exercise)
        .where(eq(exercise.trainingSessionId, originalSession.id))
        .orderBy(exercise.order);

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
    }

    return NextResponse.json({
      success: true,
      program: newProgram[0],
      message: 'Programme dupliqué avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la duplication du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la duplication' },
      { status: 500 }
    );
  }
} 