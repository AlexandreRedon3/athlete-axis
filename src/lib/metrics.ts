import { db } from './db';
import { user, program, coachClient } from '@/db';
import { eq, and } from 'drizzle-orm';

export async function getBusinessMetrics() {
  try {
    const [
      totalUsers,
      totalCoaches,
      totalClients,
      totalPrograms,
      publishedPrograms,
      totalCoachClientRelations
    ] = await Promise.all([
      db.select().from(user),
      db.select().from(user).where(eq(user.isCoach, true)),
      db.select().from(user).where(eq(user.isCoach, false)),
      db.select().from(program),
      db.select().from(program).where(eq(program.status, 'published')),
      db.select().from(coachClient),
    ]);

    return {
      totalUsers: totalUsers.length,
      activeCoaches: totalCoaches.length,
      activeClients: totalClients.length,
      totalPrograms: totalPrograms.length,
      draftPrograms: totalPrograms.length - publishedPrograms.length,
      publishedPrograms: publishedPrograms.length,
      totalCoachClientRelations: totalCoachClientRelations.length,
    };
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    return {
      totalUsers: 0,
      activeCoaches: 0,
      activeClients: 0,
      totalPrograms: 0,
      draftPrograms: 0,
      publishedPrograms: 0,
      totalCoachClientRelations: 0,
    };
  }
}