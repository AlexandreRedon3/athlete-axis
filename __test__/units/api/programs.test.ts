// __tests__/api/programs.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mocks - IMPORTANT: Ces mocks doivent être définis AVANT d'importer les modules
vi.mock("../../../src/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../../../src/lib/db", () => ({
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

// Mock des modules de base de données
vi.mock("../../../src/db/program", () => ({
  program: {
    coachId: "coachId",
    userId: "userId",
  },
}));

vi.mock("../../../src/db/program-assignment", () => ({
  programAssignment: {
    athleteId: "athleteId",
    isActive: "isActive",
  },
}));

// Mock de drizzle-orm
vi.mock("drizzle-orm/sql", () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

// Import des modules après les mocks
import { GET, POST } from "../../../app/api/programs/route";
import { auth } from "../../../src/lib/auth";
import { db } from "../../../src/lib/db";

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
        bio: null,
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

      const mockSessionData = {
        session: mockSession,
        user: mockUser,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSessionData);

      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme pour développer la force",
          level: "Débutant" as const,
          type: "Force" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          status: "published" as const,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          coachId: "coach-123",
          userId: "coach-123",
          imageUrl: null,
        },
        {
          id: "prog-2",
          name: "Programme Hypertrophie",
          description: "Programme pour la masse musculaire",
          level: "Intermédiaire" as const,
          type: "Hypertrophie" as const,
          durationWeeks: 12,
          sessionsPerWeek: 4,
          status: "draft" as const,
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          coachId: "coach-123",
          userId: "coach-123",
          imageUrl: null,
        },
      ];

      vi.mocked(db.query.program.findMany).mockResolvedValue(mockPrograms);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs");
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.programs).toHaveLength(2);
      expect(data.programs[0].name).toBe("Programme Force");
      expect(data.programs[1].name).toBe("Programme Hypertrophie");
    });

    it("devrait retourner les programmes d'un athlète", async () => {
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
        bio: null,
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

      const mockSessionData = {
        session: mockSession,
        user: mockUser,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSessionData);

      const mockAssignments = [
        {
          id: "assign-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          coachId: "coach-123",
          athleteId: "athlete-123",
          programId: "prog-1",
          startDate: new Date(),
          endDate: null,
          isActive: true,
          program: {
            id: "prog-1",
            name: "Programme Force",
            description: "Programme pour développer la force",
            level: "Débutant" as const,
            type: "Force" as const,
            durationWeeks: 8,
            sessionsPerWeek: 3,
            status: "published" as const,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            coachId: "coach-123",
            userId: "coach-123",
            imageUrl: null,
          },
        },
      ];

      vi.mocked(db.query.programAssignment.findMany).mockResolvedValue(mockAssignments);

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs");
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.programs).toHaveLength(1);
      expect(data.programs[0].name).toBe("Programme Force");
    });
  });

  describe("POST /api/programs", () => {
    it("devrait créer un nouveau programme", async () => {
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
        bio: null,
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

      const mockSessionData = {
        session: mockSession,
        user: mockUser,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSessionData);

      const newProgram = {
        name: "Nouveau Programme",
        description: "Description du nouveau programme",
        isPublished: false,
      };

      const mockCreatedProgram = {
        id: "prog-new",
        ...newProgram,
        createdAt: new Date(),
        updatedAt: new Date(),
        coachId: "coach-123",
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValue([mockCreatedProgram]),
        })),
      } as any);

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
      expect(data.program.coachId).toBe("coach-123");
    });

    it("devrait valider les données du programme", async () => {
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
        bio: null,
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

      const mockSessionData = {
        session: mockSession,
        user: mockUser,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSessionData);

      const invalidProgram = {
        name: "", // Nom vide
        description: "Description valide",
        isPublished: false,
      };

      // Act
      const request = new NextRequest("http://localhost:3000/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidProgram),
      });

      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Données invalides");
    });

    it("devrait refuser la création si l'utilisateur n'est pas coach", async () => {
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
        bio: null,
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

      const mockSessionData = {
        session: mockSession,
        user: mockUser,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSessionData);

      const newProgram = {
        name: "Nouveau Programme",
        description: "Description du nouveau programme",
        isPublished: false,
      };

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
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe("Accès refusé - Coach requis");
    });
  });
});