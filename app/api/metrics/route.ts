// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { getBusinessMetrics } from '@/lib/metrics';

// Réinitialiser le registre pour éviter les doublons
register.clear();

// Initialiser la collecte des métriques par défaut
collectDefaultMetrics({ register });

// Métriques HTTP personnalisées
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

// Métriques business AthleteAxis
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

const sessionDuration = new Histogram({
  name: 'athlete_axis_session_duration_seconds',
  help: 'User session duration in seconds',
  labelNames: ['user_type'],
  buckets: [60, 300, 900, 1800, 3600, 7200], // 1min, 5min, 15min, 30min, 1h, 2h
  registers: [register],
});

const programCompletion = new Gauge({
  name: 'athlete_axis_program_completion_rate',
  help: 'Program completion rate percentage',
  labelNames: ['program_level'],
  registers: [register],
});

// Middleware pour collecter les métriques HTTP
export function recordHttpMetrics(method: string, route: string, statusCode: number, duration: number) {
  try {
    httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    httpRequestDuration.observe({ method, route }, duration);
  } catch (error) {
    console.error('Error recording HTTP metrics:', error);
  }
}

// Fonction pour enregistrer la durée de session
export function recordSessionDuration(userType: string, duration: number) {
  try {
    sessionDuration.observe({ user_type: userType }, duration);
  } catch (error) {
    console.error('Error recording session duration:', error);
  }
}

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
    
    // Simuler les connexions DB (en réalité, vous devriez utiliser votre pool de connexions)
    databaseConnections.set(Math.floor(Math.random() * 10) + 1);
    
    // Simuler les taux de complétion par niveau
    programCompletion.set({ program_level: 'beginner' }, Math.random() * 100);
    programCompletion.set({ program_level: 'intermediate' }, Math.random() * 100);
    programCompletion.set({ program_level: 'advanced' }, Math.random() * 100);
    
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