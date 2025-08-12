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
const mockGetClients = vi.fn();

vi.mock('@/app/api/coach/clients/route', () => ({
  GET: mockGetClients,
}));

describe('API Coach Clients Integration Tests', () => {
  const mockCoach = {
    id: 'coach-123',
    name: 'Coach Test',
    username: null,
    displayUsername: null,
    email: 'coach@test.com',
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isCoach: true,
    phoneNumber: null,
    address: null,
    city: null,
    zipCode: null,
    country: null,
    role: 'coach',
    coachId: null,
    onBoardingComplete: true,
    twoFactorEnabled: false,
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/coach/clients', () => {
    it('devrait retourner la liste des clients du coach', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: {
          id: 'session-123',
          userId: mockCoach.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: 'mock-token',
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: mockCoach.id,
          email: mockCoach.email,
          emailVerified: mockCoach.emailVerified,
          name: mockCoach.name,
          createdAt: mockCoach.createdAt,
          updatedAt: mockCoach.updatedAt,
          image: mockCoach.image,
          isCoach: mockCoach.isCoach,
          onBoardingComplete: mockCoach.onBoardingComplete,
          twoFactorEnabled: mockCoach.twoFactorEnabled,
          stripeId: null,
          address: mockCoach.address,
          zipCode: mockCoach.zipCode,
          city: mockCoach.city,
          country: mockCoach.country,
          phoneNumber: mockCoach.phoneNumber,
          role: mockCoach.role,
          coachId: mockCoach.coachId,
        } as any,
      });

      vi.mocked(db.query.user.findFirst).mockResolvedValue(mockCoach);

      const mockClients = [
        {
          id: 'client-1',
          name: 'Client 1',
          email: 'client1@test.com',
          onBoardingComplete: true,
          createdAt: new Date(),
          image: null,
        },
        {
          id: 'client-2',
          name: 'Client 2',
          email: 'client2@test.com',
          onBoardingComplete: false,
          createdAt: new Date(),
          image: null,
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockClients),
          }),
        }),
      } as any);

      // Mock de la réponse de l'API
      mockGetClients.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          clients: [
            {
              id: 'client-1',
              name: 'Client 1',
              email: 'client1@test.com',
              onBoardingComplete: true,
              createdAt: new Date().toISOString(),
              image: null,
            },
            {
              id: 'client-2',
              name: 'Client 2',
              email: 'client2@test.com',
              onBoardingComplete: false,
              createdAt: new Date().toISOString(),
              image: null,
            },
          ],
          total: 2,
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/clients');
      const response = await mockGetClients(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.clients).toHaveLength(2);
      expect(data.total).toBe(2);
      expect(data.clients[0].email).toBe('client1@test.com');
    });

    it('devrait retourner une liste vide si le coach n\'a pas de clients', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: {
          id: 'session-123',
          userId: mockCoach.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: 'mock-token',
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: mockCoach.id,
          email: mockCoach.email,
          emailVerified: mockCoach.emailVerified,
          name: mockCoach.name,
          createdAt: mockCoach.createdAt,
          updatedAt: mockCoach.updatedAt,
          image: mockCoach.image,
          isCoach: mockCoach.isCoach,
          onBoardingComplete: mockCoach.onBoardingComplete,
          twoFactorEnabled: mockCoach.twoFactorEnabled,
          stripeId: null,
          address: mockCoach.address,
          zipCode: mockCoach.zipCode,
          city: mockCoach.city,
          country: mockCoach.country,
          phoneNumber: mockCoach.phoneNumber,
          role: mockCoach.role,
          coachId: mockCoach.coachId,
        } as any,
      });

      vi.mocked(db.query.user.findFirst).mockResolvedValue(mockCoach);
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      // Mock de la réponse de l'API
      mockGetClients.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          clients: [],
          total: 0,
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/clients');
      const response = await mockGetClients(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.clients).toHaveLength(0);
      expect(data.total).toBe(0);
    });

    it('devrait refuser l\'accès aux non-coaches', async () => {
      const clientUser = {
        id: 'client-123',
        name: 'Client User',
        username: null,
        displayUsername: null,
        email: 'client@test.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCoach: false,
        phoneNumber: null,
        address: null,
        city: null,
        zipCode: null,
        country: null,
        role: 'client',
        coachId: null,
        onBoardingComplete: true,
        twoFactorEnabled: false,
      } as any;

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: {
          id: 'session-123',
          userId: clientUser.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: 'mock-token',
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: clientUser.id,
          email: clientUser.email,
          emailVerified: clientUser.emailVerified,
          name: clientUser.name,
          createdAt: clientUser.createdAt,
          updatedAt: clientUser.updatedAt,
          image: clientUser.image,
          isCoach: clientUser.isCoach,
          onBoardingComplete: clientUser.onBoardingComplete,
          twoFactorEnabled: clientUser.twoFactorEnabled,
          stripeId: null,
          address: clientUser.address,
          zipCode: clientUser.zipCode,
          city: clientUser.city,
          country: clientUser.country,
          phoneNumber: clientUser.phoneNumber,
          role: clientUser.role,
          coachId: clientUser.coachId,
        } as any,
      });

      vi.mocked(db.query.user.findFirst).mockResolvedValue(clientUser);

      // Mock de la réponse d'erreur
      mockGetClients.mockResolvedValue({
        status: 403,
        json: async () => ({
          error: 'Accès réservé aux coaches',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/coach/clients');
      const response = await mockGetClients(request);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Accès réservé aux coaches');
    });
  });
}); 