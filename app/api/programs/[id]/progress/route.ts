import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { program, coachClient, user } from '@/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(
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

    // Récupérer les clients assignés à ce programme
    const coachClients = await db
      .select({
        clientId: coachClient.clientId,
        clientName: user.name,
        clientEmail: user.email
      })
      .from(coachClient)
      .innerJoin(user, eq(user.id, coachClient.clientId))
      .where(eq(coachClient.coachId, session.user.id));

    // Pour l'instant, retourner des données simulées
    // TODO: Implémenter la vraie logique de progression
    if (coachClients.length > 0) {
      const client = coachClients[0];
      
      // Données simulées de progression
      const progress = {
        clientId: client.clientId,
        clientName: client.clientName,
        completedSessions: Math.floor(Math.random() * 12) + 1, // 1-12 sessions
        totalSessions: 12,
        averageRPE: Math.floor(Math.random() * 3) + 6, // 6-8 RPE
        lastSessionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Dernière semaine
        notes: 'Progression régulière, bon engagement'
      };

      return NextResponse.json({ 
        success: true, 
        progress 
      });
    }

    // Aucun client assigné
    return NextResponse.json({ 
      success: true, 
      progress: null 
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 