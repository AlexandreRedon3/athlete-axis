// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Initialiser la collecte des métriques par défaut
collectDefaultMetrics();

// Métriques personnalisées pour AthleteAxis
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const activeUsers = new Gauge({
  name: 'athlete_axis_active_users',
  help: 'Number of active users',
  labelNames: ['user_type'], // coach, client
});

const programsTotal = new Gauge({
  name: 'athlete_axis_programs_total',
  help: 'Total number of programs',
  labelNames: ['status'], // draft, published
});

const coachClientsTotal = new Gauge({
  name: 'athlete_axis_coach_clients_total',
  help: 'Total number of coach-client relationships',
});

const databaseConnections = new Gauge({
  name: 'athlete_axis_database_connections',
  help: 'Number of active database connections',
});

// Middleware pour collecter les métriques HTTP (à implémenter dans le middleware général)
export function recordHttpMetrics(method: string, route: string, statusCode: number, duration: number) {
  httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  httpRequestDuration.observe({ method, route }, duration);
}

// Fonction pour mettre à jour les métriques business
export async function updateBusinessMetrics() {
  try {
    // Ici vous pouvez faire des requêtes à votre base de données
    // pour récupérer les métriques business actuelles
    
    // Exemple avec des données simulées - remplacez par vos vraies requêtes
    const mockMetrics = {
      activeCoaches: 25,
      activeClients: 150,
      draftPrograms: 12,
      publishedPrograms: 48,
      totalCoachClientRelations: 175,
      dbConnections: 5,
    };

    activeUsers.set({ user_type: 'coach' }, mockMetrics.activeCoaches);
    activeUsers.set({ user_type: 'client' }, mockMetrics.activeClients);
    programsTotal.set({ status: 'draft' }, mockMetrics.draftPrograms);
    programsTotal.set({ status: 'published' }, mockMetrics.publishedPrograms);
    coachClientsTotal.set(mockMetrics.totalCoachClientRelations);
    databaseConnections.set(mockMetrics.dbConnections);
  } catch (error) {
    console.error('Error updating business metrics:', error);
  }
}

export async function GET() {
  try {
    // Mettre à jour les métriques business avant de les exposer
    await updateBusinessMetrics();
    
    // Retourner les métriques au format Prometheus
    const metrics = await register.metrics();
    
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}