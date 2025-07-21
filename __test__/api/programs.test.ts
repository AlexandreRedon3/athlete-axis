// __tests__/api/programs.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "../../app/api/programs/route";
import { NextRequest } from "next/server";

// Mocks
vi.mock("../../src/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../../src/lib/db", () => ({
  db: {
    query: {
      program: {
        findMany: vi.fn(),
      },
      programAssignment: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

import { auth } from "../../src/lib/auth";
import { db } from "../../src/lib/db";

describe("API /api/programs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/programs", () => {
    it("devrait retourner 401 si non authentifié", async () => {
      // Arrange
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs");
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Non authentifié");
    });

    it("devrait retourner les programmes d'un coach", async () => {
      // Arrange
      const mockSession = {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "coach-123",
        expiresAt: new Date(Date.now() + 3600000),
        token: "mock-token",
      };

      const mockUser = {
        id: "coach-123",
        name: "Test Coach",
        email: "coach@test.com",
        emailVerified: true,
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
        phone: null,
        birthDate: null,
        phoneNumber: null,
        emailNotifications: true,
        smsNotifications: false,
      };

      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force",
          level: "Débutant" as const,
          type: "Force" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-123",
          userId: "coach-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "published" as const,
          imageUrl: null,
          trainingSessions: [],
        },
      ];

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: mockSession,
        user: mockUser,
      });
      vi.mocked(db.query.program.findMany).mockResolvedValue(mockPrograms);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs");
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.programs).toHaveLength(1);
      expect(data.programs[0].name).toBe("Programme Force");
      
      // Vérifier que la requête a été faite
      expect(db.query.program.findMany).toHaveBeenCalled();
    });

    it("devrait retourner les programmes assignés pour un athlète", async () => {
      // Arrange
      const mockSession = {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "athlete-123",
        expiresAt: new Date(Date.now() + 3600000),
        token: "mock-token",
      };

      const mockUser = {
        id: "athlete-123",
        name: "Test Athlete",
        email: "athlete@test.com",
        emailVerified: true,
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
        phone: null,
        birthDate: null,
        phoneNumber: null,
        emailNotifications: true,
        smsNotifications: false,
      };

      const mockAssignments = [
        {
          id: "assign-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          coachId: "coach-123",
          programId: "prog-1",
          athleteId: "athlete-123",
          startDate: new Date(),
          endDate: null,
          isActive: true,
          program: {
            id: "prog-1",
            name: "Programme Débutant",
            description: "Programme pour débutants",
            level: "Débutant" as const,
            type: "Mixte" as const,
            durationWeeks: 12,
            sessionsPerWeek: 3,
            coachId: "coach-123",
            userId: "coach-123",
            createdAt: new Date(),
            updatedAt: new Date(),
            trainingSessions: [],
          },
        },
      ];

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: mockSession,
        user: mockUser,
      });
      vi.mocked(db.query.programAssignment.findMany).mockResolvedValue(mockAssignments);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs");
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.programs).toHaveLength(1);
      expect(data.programs[0].name).toBe("Programme Débutant");
    });
  });

  describe("POST /api/programs", () => {
    it("devrait créer un programme si coach", async () => {
      // Arrange
      const mockSession = {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "coach-123",
        expiresAt: new Date(Date.now() + 3600000),
        token: "mock-token",
      };

      const mockUser = {
        id: "coach-123",
        name: "Test Coach",
        email: "coach@test.com",
        emailVerified: true,
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
        phone: null,
        birthDate: null,
        phoneNumber: null,
        emailNotifications: true,
        smsNotifications: false,
      };

      const newProgram = {
        name: "Nouveau Programme",
        durationWeeks: 12,
        sessionsPerWeek: 4,
        type: "Force" as const,
        description: "Programme de force pour débutants",
        level: "Débutant" as const,
      };

      const mockCreatedProgram = {
        ...newProgram,
        id: "new-prog-id",
        coachId: "coach-123",
        userId: "coach-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
        imageUrl: null,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: mockSession,
        user: mockUser,
      });
      
      const mockReturning = vi.fn().mockResolvedValue([mockCreatedProgram]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProgram),
      });

      const response = await POST(request);

      // Assert
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.program.name).toBe("Nouveau Programme");
      expect(data.program.id).toBe("new-prog-id");
    });

    it("devrait refuser si pas coach", async () => {
      // Arrange
      const mockSession = {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "athlete-123",
        expiresAt: new Date(Date.now() + 3600000),
        token: "mock-token",
      };

      const mockUser = {
        id: "athlete-123",
        name: "Test Athlete",
        email: "athlete@test.com",
        emailVerified: true,
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
        phone: null,
        birthDate: null,
        phoneNumber: null,
        emailNotifications: true,
        smsNotifications: false,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: mockSession,
        user: mockUser,
      });

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Programme",
          durationWeeks: 8,
          sessionsPerWeek: 3,
        }),
      });

      const response = await POST(request);

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("devrait valider les données d'entrée", async () => {
      // Arrange
      const mockSession = {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "coach-123",
        expiresAt: new Date(Date.now() + 3600000),
        token: "mock-token",
      };

      const mockUser = {
        id: "coach-123",
        name: "Test Coach",
        email: "coach@test.com",
        emailVerified: true,
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
        phone: null,
        birthDate: null,
        phoneNumber: null,
        emailNotifications: true,
        smsNotifications: false,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue({
        session: mockSession,
        user: mockUser,
      });

      // Act - Données invalides (nom vide)
      const request = new NextRequest("http://localhost:3000/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          durationWeeks: 8,
          sessionsPerWeek: 3,
          type: "Force",
          description: "Test",
          level: "Débutant",
        }),
      });

      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Données invalides");
      expect(data.details).toBeDefined();
    });
  });
});