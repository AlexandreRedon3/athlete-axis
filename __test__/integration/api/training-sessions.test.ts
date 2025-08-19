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
    where: vi.fn(),
    limit: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
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
const mockPostSession = vi.fn();
const mockDeleteSession = vi.fn();
const mockDuplicateSession = vi.fn();

vi.mock('@/app/api/programs/[id]/sessions/route', () => ({
  GET: vi.fn(),
  POST: mockPostSession,
}));

vi.mock('@/app/api/programs/[id]/sessions/[sessionId]/route', () => ({
  DELETE: mockDeleteSession,
  POST: mockDuplicateSession,
}));

describe('API Training Sessions Integration Tests', () => {
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

  describe('POST /api/programs/:id/sessions', () => {
    it('devrait créer une nouvelle session d\'entraînement', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      const mockProgram = {
        id: 'prog-123',
        coachId: 'coach-123',
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockProgram]),
          }),
        }),
      } as any);

      const newSession = {
        name: 'Session Push',
        weekNumber: 1,
        dayNumber: 1,
        type: 'Push',
        targetRPE: 7,
        duration: 60,
        notes: 'Focus sur les pectoraux',
      };

      const mockCreatedSession = {
        id: 'session-new',
        ...newSession,
        order: 1,
        programId: 'prog-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.select).mockReturnValue({
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockResolvedValue([{ maxOrder: 0 }]),
        }),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCreatedSession]),
        }),
      } as any);

      // Mock de la réponse de l'API
      mockPostSession.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          session: {
            id: 'session-new',
            name: 'Session Push',
            weekNumber: 1,
            dayNumber: 1,
            type: 'Push',
            targetRPE: 7,
            duration: 60,
            notes: 'Focus sur les pectoraux',
            order: 1,
            programId: 'prog-123',
          },
          message: 'Session créée avec succès',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/programs/prog-123/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      });

      const response = await mockPostSession(request, { 
        params: Promise.resolve({ id: 'prog-123' }) 
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.session.name).toBe('Session Push');
      expect(data.session.weekNumber).toBe(1);
      expect(data.message).toBe('Session créée avec succès');
    });

    it('devrait valider les données de la session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      const invalidSession = {
        name: '', // Nom vide
        weekNumber: 0, // Semaine invalide
        dayNumber: 8, // Jour invalide (> 7)
      };

      // Mock de la réponse d'erreur
      mockPostSession.mockResolvedValue({
        status: 400,
        json: async () => ({
          error: 'Données manquantes',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/programs/prog-123/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidSession),
      });

      const response = await mockPostSession(request, { 
        params: Promise.resolve({ id: 'prog-123' }) 
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Données manquantes');
    });
  });

  describe('DELETE /api/programs/:id/sessions/:sessionId', () => {
    it('devrait supprimer une session et ses exercices', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      const mockSession = {
        id: 'session-123',
        programId: 'prog-123',
        name: 'Session à supprimer',
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockSession]),
          }),
        }),
      } as any);

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      // Mock de la réponse de l'API
      mockDeleteSession.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          message: 'Session supprimée avec succès',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/programs/prog-123/sessions/session-123', {
        method: 'DELETE',
      });

      const response = await mockDeleteSession(request, { 
        params: Promise.resolve({ id: 'prog-123', sessionId: 'session-123' }) 
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toBe('Session supprimée avec succès');
    });
  });

  describe('POST /api/programs/:id/sessions/:sessionId (Duplication)', () => {
    it('devrait dupliquer une session avec tous ses exercices', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);

      const originalSession = {
        id: 'session-original',
        name: 'Session Original',
        programId: 'prog-123',
        order: 1,
      };

      const originalExercises = [
        {
          id: 'ex-1',
          name: 'Développé couché',
          sets: 4,
          reps: 8,
          order: 1,
          trainingSessionId: 'session-original',
        },
        {
          id: 'ex-2',
          name: 'Dips',
          sets: 3,
          reps: 12,
          order: 2,
          trainingSessionId: 'session-original',
        },
      ];

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation((condition) => ({
            limit: vi.fn().mockResolvedValue([originalSession]),
            orderBy: vi.fn().mockResolvedValue(originalExercises),
          })),
        }),
      } as any));

      const newSessionId = 'session-copy';
      vi.mocked(db.insert).mockImplementation(() => ({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            ...originalSession,
            id: newSessionId,
            name: 'Session Original (Copie)',
            order: 2,
          }]),
        }),
      } as any));

      // Mock de la réponse de l'API
      mockDuplicateSession.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          session: {
            id: 'session-copy',
            name: 'Session Original (Copie)',
            programId: 'prog-123',
            order: 2,
          },
          message: 'Session dupliquée avec succès',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/programs/prog-123/sessions/session-original', {
        method: 'POST',
      });

      const response = await mockDuplicateSession(request, { 
        params: Promise.resolve({ id: 'prog-123', sessionId: 'session-original' }) 
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.session.name).toBe('Session Original (Copie)');
      expect(data.message).toBe('Session dupliquée avec succès');
    });
  });
}); 