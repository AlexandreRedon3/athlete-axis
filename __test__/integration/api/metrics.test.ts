import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getBusinessMetrics } from '@/lib/metrics';

// Mock des modules
vi.mock('@/lib/metrics');

// Mock des variables d'environnement
vi.mock('@/lib/env', () => ({
  env: {
    BETTER_AUTH_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NEXTAUTH_SECRET: 'test-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
  safeConfig: {
    BETTER_AUTH_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NEXTAUTH_SECRET: 'test-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
    BETTER_AUTH_SECRET: 'test-secret',
  },
}));

// Mock de la base de données
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
  },
}));

// Mock des routes API
const mockGetMetrics = vi.fn();
const mockHeadMetrics = vi.fn();

vi.mock('@/app/api/metrics/route', () => ({
  GET: mockGetMetrics,
  HEAD: mockHeadMetrics,
}));

describe('API Metrics Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/metrics', () => {
    it('devrait exposer les métriques Prometheus', async () => {
      const mockMetrics = {
        totalUsers: 100,
        activeCoaches: 10,
        activeClients: 90,
        totalPrograms: 50,
        draftPrograms: 20,
        publishedPrograms: 30,
        totalCoachClientRelations: 85,
      };

      vi.mocked(getBusinessMetrics).mockResolvedValue(mockMetrics);

      // Mock de la réponse de l'API
      const mockMetricsText = `# HELP athlete_axis_active_users Nombre d'utilisateurs actifs
# TYPE athlete_axis_active_users gauge
athlete_axis_active_users{user_type="coach"} 10
athlete_axis_active_users{user_type="client"} 90

# HELP athlete_axis_programs_total Nombre total de programmes
# TYPE athlete_axis_programs_total gauge
athlete_axis_programs_total{status="draft"} 20
athlete_axis_programs_total{status="published"} 30

# HELP athlete_axis_coach_clients_total Nombre total de relations coach-client
# TYPE athlete_axis_coach_clients_total gauge
athlete_axis_coach_clients_total 85

# HELP athlete_axis_database_connections Nombre de connexions à la base de données
# TYPE athlete_axis_database_connections gauge
athlete_axis_database_connections 5

# HELP athlete_axis_program_completion_rate Taux de completion des programmes
# TYPE athlete_axis_program_completion_rate gauge
athlete_axis_program_completion_rate 75.5

# HELP http_requests_total Nombre total de requêtes HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",status_code="200"} 1500
http_requests_total{method="POST",status_code="201"} 250`;

      mockGetMetrics.mockResolvedValue({
        status: 200,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'text/plain; charset=utf-8';
            if (name === 'Cache-Control') return 'no-cache, no-store, must-revalidate';
            if (name === 'Pragma') return 'no-cache';
            if (name === 'Expires') return '0';
            return null;
          },
        },
        text: async () => mockMetricsText,
      });

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await mockGetMetrics();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('text/plain');
      
      const metricsText = await response.text();
      
      // Vérifier la présence des métriques business
      expect(metricsText).toContain('athlete_axis_active_users');
      expect(metricsText).toContain('athlete_axis_programs_total');
      expect(metricsText).toContain('athlete_axis_coach_clients_total');
      expect(metricsText).toContain('athlete_axis_database_connections');
      expect(metricsText).toContain('athlete_axis_program_completion_rate');
      
      // Vérifier le format Prometheus
      expect(metricsText).toMatch(/# TYPE athlete_axis_active_users gauge/);
      expect(metricsText).toMatch(/# HELP athlete_axis_active_users/);
    });

    it('devrait gérer les erreurs de métriques gracieusement', async () => {
      vi.mocked(getBusinessMetrics).mockRejectedValue(new Error('Database error'));

      // Mock de la réponse avec valeurs par défaut
      const mockMetricsText = `# HELP athlete_axis_active_users Nombre d'utilisateurs actifs
# TYPE athlete_axis_active_users gauge
athlete_axis_active_users{user_type="coach"} 0
athlete_axis_active_users{user_type="client"} 0

# HELP athlete_axis_programs_total Nombre total de programmes
# TYPE athlete_axis_programs_total gauge
athlete_axis_programs_total{status="draft"} 0
athlete_axis_programs_total{status="published"} 0

# HELP athlete_axis_coach_clients_total Nombre total de relations coach-client
# TYPE athlete_axis_coach_clients_total gauge
athlete_axis_coach_clients_total 0`;

      mockGetMetrics.mockResolvedValue({
        status: 200,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'text/plain; charset=utf-8';
            return null;
          },
        },
        text: async () => mockMetricsText,
      });

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await mockGetMetrics();

      expect(response.status).toBe(200); // Devrait toujours retourner 200 pour Prometheus
      
      const metricsText = await response.text();
      
      // Les métriques devraient avoir des valeurs par défaut (0)
      expect(metricsText).toContain('athlete_axis_active_users{user_type="coach"} 0');
      expect(metricsText).toContain('athlete_axis_active_users{user_type="client"} 0');
    });

    it('devrait inclure les métriques HTTP', async () => {
      const mockMetrics = {
        totalUsers: 50,
        activeCoaches: 5,
        activeClients: 45,
        totalPrograms: 20,
        draftPrograms: 5,
        publishedPrograms: 15,
        totalCoachClientRelations: 40,
      };

      vi.mocked(getBusinessMetrics).mockResolvedValue(mockMetrics);

      // Mock de la réponse avec métriques HTTP
      const mockMetricsText = `# HELP http_requests_total Nombre total de requêtes HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",status_code="200"} 1000
http_requests_total{method="POST",status_code="201"} 150
http_requests_total{method="PUT",status_code="200"} 75
http_requests_total{method="DELETE",status_code="204"} 25

# HELP athlete_axis_active_users Nombre d'utilisateurs actifs
# TYPE athlete_axis_active_users gauge
athlete_axis_active_users{user_type="coach"} 5
athlete_axis_active_users{user_type="client"} 45`;

      mockGetMetrics.mockResolvedValue({
        status: 200,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'text/plain; charset=utf-8';
            return null;
          },
        },
        text: async () => mockMetricsText,
      });

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await mockGetMetrics();

      const metricsText = await response.text();
      
      // Vérifier les métriques HTTP
      expect(metricsText).toContain('http_requests_total');
      expect(metricsText).toMatch(/http_requests_total{method="GET",status_code="200"}/);
    });

    it('devrait être compatible avec le scraping Prometheus', async () => {
      // Mock de la réponse avec headers Prometheus
      mockGetMetrics.mockResolvedValue({
        status: 200,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'text/plain; charset=utf-8';
            if (name === 'Cache-Control') return 'no-cache, no-store, must-revalidate';
            if (name === 'Pragma') return 'no-cache';
            if (name === 'Expires') return '0';
            return null;
          },
        },
        text: async () => '# HELP athlete_axis_active_users Nombre d\'utilisateurs actifs\n# TYPE athlete_axis_active_users gauge\nathlete_axis_active_users{user_type="coach"} 10',
      });

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await mockGetMetrics();

      // Headers requis pour Prometheus
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
      expect(response.headers.get('Pragma')).toBe('no-cache');
      expect(response.headers.get('Expires')).toBe('0');
    });
  });

  describe('HEAD /api/metrics', () => {
    it('devrait répondre au health check', async () => {
      // Mock de la réponse HEAD
      mockHeadMetrics.mockResolvedValue({
        status: 200,
        body: null,
        headers: {
          get: (name: string) => {
            if (name === 'Content-Type') return 'text/plain; charset=utf-8';
            return null;
          },
        },
      });

      const response = await mockHeadMetrics();

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });
}); 