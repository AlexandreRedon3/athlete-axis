import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { program } from '@/db';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// POST - Publier un programme
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

    // Vérifier que le programme appartient au coach
    const programExists = await db
      .select()
      .from(program)
      .where(eq(program.id, programId))
      .limit(1);

    if (programExists.length === 0) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    const currentProgram = programExists[0];

    // Vérifier que le programme n'est pas déjà publié
    if (currentProgram.status === 'published') {
      return NextResponse.json({ 
        error: 'Le programme est déjà publié' 
      }, { status: 400 });
    }

    // Publier le programme
    const publishedProgram = await db
      .update(program)
      .set({
        status: 'published',
        updatedAt: new Date()
      })
      .where(eq(program.id, programId))
      .returning();

    return NextResponse.json({
      success: true,
      program: publishedProgram[0],
      message: 'Programme publié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la publication du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la publication' },
      { status: 500 }
    );
  }
}

// DELETE - Dépublier un programme (retourner en brouillon)
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

    const currentProgram = programExists[0];

    // Vérifier que le programme est publié
    if (currentProgram.status === 'draft') {
      return NextResponse.json({ 
        error: 'Le programme est déjà en brouillon' 
      }, { status: 400 });
    }

    // Dépublier le programme
    const unpublishedProgram = await db
      .update(program)
      .set({
        status: 'draft',
        updatedAt: new Date()
      })
      .where(eq(program.id, programId))
      .returning();

    return NextResponse.json({
      success: true,
      program: unpublishedProgram[0],
      message: 'Programme mis en brouillon avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la dépublication du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la dépublication' },
      { status: 500 }
    );
  }
} 