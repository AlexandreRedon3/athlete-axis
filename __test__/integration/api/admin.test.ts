import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Mock des modules
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      user: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('bcryptjs');

// Mock des routes API
const mockCreateUser = vi.fn();
const mockListUsers = vi.fn();
const mockDeleteUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockUpdateCoachStatus = vi.fn();

vi.mock('@/app/api/admin/create-user/route', () => ({
  POST: mockCreateUser,
  GET: mockListUsers,
}));

vi.mock('@/app/api/admin/delete-user/route', () => ({
  DELETE: mockDeleteUser,
}));

vi.mock('@/app/api/admin/update-user/route', () => ({
  PUT: mockUpdateUser,
}));

vi.mock('@/app/api/admin/update-coach-status/route', () => ({
  PUT: mockUpdateCoachStatus,
}));

describe('API Admin Integration Tests', () => {
  const ADMIN_SECRET = 'test-admin-secret';
  
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_SECRET = ADMIN_SECRET;
  });

  describe('Admin Authentication', () => {
    it('devrait refuser l\'accès sans clé secrète', async () => {
      // Mock de la réponse d'erreur
      mockCreateUser.mockResolvedValue({
        status: 401,
        json: async () => ({
          error: 'Clé d\'authentification manquante',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123',
        }),
      });

      const response = await mockCreateUser(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Clé d\'authentification manquante');
    });

    it('devrait refuser l\'accès avec une mauvaise clé', async () => {
      // Mock de la réponse d'erreur
      mockCreateUser.mockResolvedValue({
        status: 401,
        json: async () => ({
          error: 'Clé d\'authentification invalide',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer wrong-secret',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@test.com',
          password: 'password123',
        }),
      });

      const response = await mockCreateUser(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Clé d\'authentification invalide');
    });
  });

  describe('POST /api/admin/create-user', () => {
    it('devrait créer un utilisateur admin', async () => {
      vi.mocked(db.query.user.findFirst).mockResolvedValue(undefined);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
      
      const newUser = {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'SecurePass123!',
        role: 'admin',
        isCoach: true,
        phoneNumber: '+33612345678',
        address: '123 Admin Street',
        city: 'Paris',
        zipCode: '75001',
        country: 'France',
      };

      // Mock de la réponse de succès
      mockCreateUser.mockResolvedValue({
        status: 201,
        json: async () => ({
          success: true,
          message: 'Utilisateur admin créé avec succès',
          user: {
            id: 'new-user-id',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'admin',
            isCoach: true,
          },
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${ADMIN_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const response = await mockCreateUser(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toBe('Utilisateur admin créé avec succès');
    });

    it('devrait empêcher la création avec un email existant', async () => {
      const existingUser = {
        id: 'existing-user',
        name: 'Existing User',
        username: null,
        displayUsername: null,
        email: 'existing@test.com',
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
      } as any;

      vi.mocked(db.query.user.findFirst).mockResolvedValue(existingUser);

      // Mock de la réponse d'erreur
      mockCreateUser.mockResolvedValue({
        status: 409,
        json: async () => ({
          error: 'Cette adresse email est déjà utilisée',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${ADMIN_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test',
          email: 'existing@test.com',
          password: 'password123',
          role: 'client',
        }),
      });

      const response = await mockCreateUser(request);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('Cette adresse email est déjà utilisée');
    });
  });

  describe('GET /api/admin/create-user (List Users)', () => {
    it('devrait lister tous les utilisateurs sans les mots de passe', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
          username: null,
          displayUsername: null,
          email: 'user1@test.com',
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
        },
        {
          id: 'user-2',
          name: 'User 2',
          username: null,
          displayUsername: null,
          email: 'user2@test.com',
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
        },
      ] as any;

      vi.mocked(db.query.user.findMany).mockResolvedValue(mockUsers);

      // Mock de la réponse de succès
      mockListUsers.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          users: [
            {
              id: 'user-1',
              name: 'User 1',
              email: 'user1@test.com',
              isCoach: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'user-2',
              name: 'User 2',
              email: 'user2@test.com',
              isCoach: false,
              createdAt: new Date().toISOString(),
            },
          ],
          count: 2,
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/create-user', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
      });

      const response = await mockListUsers(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.users).toHaveLength(2);
      expect(data.count).toBe(2);
      expect(data.users[0]).not.toHaveProperty('password');
    });
  });

  describe('DELETE /api/admin/delete-user', () => {
    it('devrait supprimer un utilisateur et ses relations', async () => {
      const userToDelete = {
        id: 'user-to-delete',
        name: 'Delete Me',
        username: null,
        displayUsername: null,
        email: 'delete@test.com',
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
      } as any;

      vi.mocked(db.query.user.findFirst).mockResolvedValue(userToDelete);
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      // Mock de la réponse de succès
      mockDeleteUser.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          message: 'Utilisateur supprimé avec succès',
          deletedUser: {
            id: 'user-to-delete',
            email: 'delete@test.com',
            name: 'Delete Me',
          },
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${ADMIN_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user-to-delete' }),
      });

      const response = await mockDeleteUser(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toBe('Utilisateur supprimé avec succès');
      expect(data.deletedUser.email).toBe('delete@test.com');
    });
  });

  describe('PUT /api/admin/update-coach-status', () => {
    it('devrait mettre à jour le statut coach d\'un utilisateur', async () => {
      const existingUser = {
        id: 'user-123',
        name: 'Test User',
        username: null,
        displayUsername: null,
        email: 'test@test.com',
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
      } as any;

      vi.mocked(db.query.user.findFirst).mockResolvedValue(existingUser);
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{
              ...existingUser,
              isCoach: true,
            }]),
          }),
        }),
      } as any);

      // Mock de la réponse de succès
      mockUpdateCoachStatus.mockResolvedValue({
        status: 200,
        json: async () => ({
          success: true,
          message: 'Statut coach mis à jour avec succès',
          user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@test.com',
            isCoach: true,
          },
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/admin/update-coach-status', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${ADMIN_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-123',
          isCoach: true,
        }),
      });

      const response = await mockUpdateCoachStatus(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toContain('Statut coach mis à jour avec succès');
      expect(data.user.isCoach).toBe(true);
    });
  });
}); 