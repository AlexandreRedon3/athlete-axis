// app/api/metrics/route.ts - VERSION COMPATIBLE EDGE RUNTIME
import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { getBusinessMetrics } from '@/lib/metrics';

// Réinitialiser le registre pour éviter les doublons
register.clear();

// ⚠️ collectDefaultMetrics() désactivé car incompatible Edge Runtime
// collectDefaultMetrics({ register });

// Métriques business AthleteAxis uniquement
const activeUsers = new Gauge({
  name: 'athlete_axis_active_users',
  help: 'Number of active users',
  labelNames: ['user_type'], 
  registers: [register],
});

const programsTotal = new Gauge({
  name: 'athlete_axis_programs_total',
  help: 'Total number of programs',
  labelNames: ['status'], 
  registers: [register],
});

const coachClientsTotal = new Gauge({
  name: 'athlete_axis_coach_clients_total',
  help: 'Total number of coach-client relationships',
  registers: [register],
});

const databaseConnections = new Gauge({
  name: 'athlete_axis_database_connections',
  help: 'Number of active database connections',
  registers: [register],
});

const programCompletion = new Gauge({
  name: 'athlete_axis_program_completion_rate',
  help: 'Program completion rate percentage',
  labelNames: ['program_level'],
  registers: [register],
});

// Métriques HTTP simplifiées (sans collecte automatique du middleware)
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status_code'],
  registers: [register],
});

// Fonction pour mettre à jour les métriques business
export async function updateBusinessMetrics() {
  try {
    const businessMetrics = await getBusinessMetrics();
    
    // Mettre à jour les utilisateurs actifs
    activeUsers.set({ user_type: 'coach' }, businessMetrics.activeCoaches);
    activeUsers.set({ user_type: 'client' }, businessMetrics.activeClients);
    
    // Mettre à jour les programmes
    programsTotal.set({ status: 'draft' }, businessMetrics.draftPrograms);
    programsTotal.set({ status: 'published' }, businessMetrics.publishedPrograms);
    
    // Relations coach-client
    coachClientsTotal.set(businessMetrics.totalCoachClientRelations);
    
    // Simuler les connexions DB
    databaseConnections.set(Math.floor(Math.random() * 10) + 1);
    
    // Simuler les taux de complétion par niveau
    programCompletion.set({ program_level: 'beginner' }, Math.random() * 100);
    programCompletion.set({ program_level: 'intermediate' }, Math.random() * 100);
    programCompletion.set({ program_level: 'advanced' }, Math.random() * 100);
    
    // Ajouter quelques métriques HTTP pour les tests
    httpRequestsTotal.inc({ method: 'GET', status_code: '200' }, Math.floor(Math.random() * 100));
    httpRequestsTotal.inc({ method: 'POST', status_code: '200' }, Math.floor(Math.random() * 50));
    httpRequestsTotal.inc({ method: 'GET', status_code: '404' }, Math.floor(Math.random() * 10));
    
    console.log('✅ Business metrics updated successfully');
  } catch (error) {
    console.error('❌ Error updating business metrics:', error);
    
    // Valeurs par défaut en cas d'erreur
    activeUsers.set({ user_type: 'coach' }, 0);
    activeUsers.set({ user_type: 'client' }, 0);
    programsTotal.set({ status: 'draft' }, 0);
    programsTotal.set({ status: 'published' }, 0);
    coachClientsTotal.set(0);
    databaseConnections.set(0);
  }
}

// Endpoint principal
export async function GET() {
  try {
    // Mettre à jour les métriques business avant de les exposer
    await updateBusinessMetrics();
    
    // Générer et retourner les métriques au format Prometheus
    const metrics = await register.metrics();
    
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Endpoint de santé pour vérifier si le service de métriques fonctionne
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// ⚠️ FONCTION DÉSACTIVÉE - incompatible Edge Runtime
// export function recordHttpMetrics() { ... }