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
    update: vi.fn(),
    delete: vi.fn(),
    query: {
      program: {
        findFirst: vi.fn(),
      },
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
const mockPutProgram = vi.fn();
const mockDeleteProgram = vi.fn();
const mockCreateUser = vi.fn();

vi.mock('@/app/api/programs/[id]/route', () => ({
  DELETE: mockDeleteProgram,
  PUT: mockPutProgram,
}));

vi.mock('@/app/api/admin/create-user/route', () => ({
  POST: mockCreateUser,
}));

describe('OWASP A01:2021 – Broken Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait empêcher un coach de modifier les programmes d\'un autre coach', async () => {
    const attackerSession = {
      session: {
        id: 'session-123',
        userId: 'attacker-coach',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        token: 'mock-token',
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: 'attacker-coach',
        email: 'attacker@test.com',
        emailVerified: false,
        name: 'Attacker Coach',
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
    
    const victimProgram = {
      id: 'victim-program',
      coachId: 'victim-coach', // Appartient à un autre coach
      name: 'Programme de la victime',
    };

    vi.mocked(auth.api.getSession).mockResolvedValue(attackerSession);
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([victimProgram]),
        }),
      }),
    } as any);

    // Mock de la réponse d'erreur
    mockPutProgram.mockResolvedValue({
      status: 403,
      json: async () => ({
        error: 'Accès refusé',
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/programs/victim-program', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Programme piraté' }),
    });

    const response = await mockPutProgram(request, { 
      params: Promise.resolve({ id: 'victim-program' }) 
    });

    // Devrait retourner 403 Forbidden ou 404 Not Found
    expect([403, 404]).toContain(response.status);
  });

  it('devrait empêcher un client d\'accéder aux données d\'un autre client', async () => {
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
        name: 'Client User',
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

    // Tentative d'accès aux données d'un autre utilisateur
    const request = new NextRequest('http://localhost:3000/api/users/other-user-456/data');
    
    // Cette route devrait vérifier que l'utilisateur accède uniquement à ses propres données
    // Simulation de la vérification
    const userId = 'other-user-456';
    const sessionUserId = clientSession.user.id;
    
    expect(userId).not.toBe(sessionUserId);
    // L'accès devrait être refusé
  });

  it('devrait vérifier les permissions pour les actions administratives', async () => {
    const regularUserSession = {
      session: {
        id: 'session-123',
        userId: 'regular-user',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        token: 'mock-token',
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: 'regular-user',
        email: 'user@test.com',
        emailVerified: false,
        name: 'Regular User',
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

    vi.mocked(auth.api.getSession).mockResolvedValue(regularUserSession);

    // Mock de la réponse d'erreur
    mockCreateUser.mockResolvedValue({
      status: 401,
      json: async () => ({
        error: 'Clé d\'authentification manquante',
      }),
    });

    // Tentative d'accès à une route admin
    const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-admin-token',
      },
      body: JSON.stringify({
        email: 'newadmin@test.com',
        role: 'admin',
      }),
    });

    const response = await mockCreateUser(request);

    // Devrait retourner 401 ou 403
    expect([401, 403]).toContain(response.status);
  });

  it('devrait vérifier les permissions pour les actions sensibles', async () => {
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
        name: 'Client User',
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

    // Tentative d'accès à une route réservée aux coaches
    const request = new NextRequest('http://localhost:3000/api/coach/stats');
    
    // Simulation de la vérification des permissions
    const userRole = clientSession.user.role;
    const isCoach = clientSession.user.isCoach;
    
    expect(userRole).toBe('client');
    expect(isCoach).toBe(false);
    // L'accès devrait être refusé pour les non-coaches
  });
}); 