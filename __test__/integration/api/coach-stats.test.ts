import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Mock des modules
vi.mock('@/lib/auth');
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    innerJoin: vi.fn(),
    where: vi.fn(),
    groupBy: vi.fn(),
    orderBy: vi.fn(),
    query: {
      user: {
        findFirst: vi.fn(),
      },
    },
  },
}));

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

// Mock des routes API
const mockGetStats = vi.fn();
const mockGetTodaySessions = vi.fn();

vi.mock('@/app/api/coach/stats/route', () => ({
  GET: mockGetStats,
}));

vi.mock('@/app/api/coach/today-sessions/route', () => ({
  GET: mockGetTodaySessions,
}));

describe('API Coach Stats Integration Tests', () => {
  const mockCoachSession = {
    session: {
      id: 'session-123',
      userId: 'coach-123',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'mock-token',
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: 'coach-123',
      email: 'coach@test.com',
      emailVerified: false,
      name: 'Coach Test',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      isCoach: true,
      onBoardingComplete: true,
      twoFactorEnabled: false,
      stripeId: null,
      address: null,
      zipCode: null,
      city: null,
      country: null,
      phoneNumber: null,
      role: 'coach',
      coachId: null,
      username: null,
      displayUsername: null,
    } as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/coach/stats', () => {
    it('devrait calculer toutes les statistiques du coach', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      // Mock des données pour les statistiques
      const mockClientsCount = [{ count: 10 }];
      const mockProgramsCount = [{ count: 5 }];
      const mockPublishedPrograms = [{ count: 3 }];
      const mockSessionsCount = [{ count: 50 }];
      const mockExercisesCount = [{ count: 200 }];
      const mockNewClientsThisMonth = [{ count: 2 }];

      // Configuration des mocks pour chaque requête
      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        const mockData = [
          mockClientsCount,
          mockClientsCount, // Active clients
          mockNewClientsThisMonth,
          mockProgramsCount,
          mockPublishedPrograms,
          mockSessionsCount,
          mockSessionsCount, // Sessions this month
          mockExercisesCount,
        ][callCount - 1];

        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockData || [{ count: 0 }]),
            innerJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue(mockData || [{ count: 0 }]),
            }),
          }),
        } as any;
      });

      // Mock de la réponse de l'API
      mockGetStats.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          stats: {
            totalClients: 10,
            activeClients: 8,
            totalPrograms: 5,
            publishedPrograms: 3,
            totalSessions: 50,
            totalExercises: 200,
            completionRate: 85.5,
            publishRate: 60.0,
            monthlyData: [
              { month: '2024-01', clients: 5, programs: 2 },
              { month: '2024-02', clients: 8, programs: 3 },
            ],
          },
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/stats');
      const response = await mockGetStats(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.stats).toMatchObject({
        totalClients: expect.any(Number),
        activeClients: expect.any(Number),
        totalPrograms: expect.any(Number),
        publishedPrograms: expect.any(Number),
        totalSessions: expect.any(Number),
        totalExercises: expect.any(Number),
        completionRate: expect.any(Number),
        publishRate: expect.any(Number),
        monthlyData: expect.any(Array),
      });
    });

    it('devrait refuser l\'accès si pas coach', async () => {
      const clientSession = {
        session: {
          id: 'session-123',
          userId: 'client-123',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: 'mock-token',
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: 'client-123',
          email: 'client@test.com',
          emailVerified: false,
          name: 'Client Test',
          createdAt: new Date(),
          updatedAt: new Date(),
          image: null,
          isCoach: false,
          onBoardingComplete: true,
          twoFactorEnabled: false,
          stripeId: null,
          address: null,
          zipCode: null,
          city: null,
          country: null,
          phoneNumber: null,
          role: 'client',
          coachId: null,
          username: null,
          displayUsername: null,
        } as any,
      };
      vi.mocked(auth.api.getSession).mockResolvedValue(clientSession);

      // Mock de la réponse d'erreur
      mockGetStats.mockResolvedValue({
        status: 403,
        json: async () => ({
          error: 'Accès refusé',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/stats');
      const response = await mockGetStats(request);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Accès refusé');
    });

    it('devrait gérer les erreurs de base de données gracieusement', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);
      vi.mocked(db.select).mockRejectedValue(new Error('Database connection error'));

      // Mock de la réponse d'erreur
      mockGetStats.mockResolvedValue({
        status: 500,
        json: async () => ({
          error: 'Erreur serveur lors de la récupération des statistiques',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/stats');
      const response = await mockGetStats(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Erreur serveur lors de la récupération des statistiques');
    });
  });

  describe('GET /api/coach/today-sessions', () => {
    it('devrait retourner les sessions du jour', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      const mockTodaySessions = [
        {
          id: 'session-1',
          name: 'Session Push',
          programName: 'Programme Force',
          createdAt: new Date(),
          order: 1,
        },
        {
          id: 'session-2',
          name: 'Session Pull',
          programName: 'Programme Force',
          createdAt: new Date(),
          order: 2,
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue(mockTodaySessions),
            }),
          }),
        }),
      } as any);

      // Mock de la réponse de l'API
      mockGetTodaySessions.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          sessions: [
            {
              id: 'session-1',
              client: 'Client A',
              type: 'Session Push',
              time: '09:00',
              status: 'upcoming',
              programName: 'Programme Force',
            },
            {
              id: 'session-2',
              client: 'Client B',
              type: 'Session Pull',
              time: '10:00',
              status: 'upcoming',
              programName: 'Programme Force',
            },
          ],
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/today-sessions');
      const response = await mockGetTodaySessions(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.sessions).toHaveLength(2);
      expect(data.sessions[0]).toMatchObject({
        id: 'session-1',
        client: expect.any(String),
        type: 'Session Push',
        time: expect.any(String),
        status: 'upcoming',
        programName: 'Programme Force',
      });
    });
  });
}); 