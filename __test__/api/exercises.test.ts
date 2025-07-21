// __tests__/api/exercises.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST, GET } from "../../app/api/trainings/[sessionId]/exercises/route";
import { DELETE } from "../../app/api/trainings/[sessionId]/route";
import { NextRequest } from "next/server";

// Mocks
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      trainingSession: {
        findFirst: vi.fn(),
      },
      exercise: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

describe("API Exercices", () => {
  // Mock session complète
  const mockCoachSession = {
    session: {
      id: "session-123",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "coach-123",
      expiresAt: new Date(Date.now() + 3600000),
      token: "mock-token",
    },
    user: {
      id: "coach-123",
      isCoach: true,
      name: "Test Coach",
      email: "coach@test.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
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
    },
  };

  // Mock trainingSession complet
  const mockTrainingSession = {
    id: "session-123",
    name: "Session Test",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: null,
    programId: "prog-123",
    order: 1,
    program: {
      id: "prog-123",
      coachId: "coach-123",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/sessions/:sessionId/exercises", () => {
    it("devrait créer un exercice", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);
      vi.mocked(db.query.trainingSession.findFirst).mockResolvedValue(mockTrainingSession);

      const newExercise = {
        name: "Développé couché",
        sets: 4,
        reps: 8,
        rpe: 8,
        restSeconds: 180,
        order: 1,
      };

      const mockCreated = {
        id: "ex-123",
        ...newExercise,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
        trainingSessionId: "session-123",
      };

      const mockReturning = vi.fn().mockResolvedValue([mockCreated]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

      const request = new NextRequest("http://localhost:3000/api/sessions/session-123/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      });

      const response = await POST(request, { params: { sessionId: "session-123" } });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.exercise.name).toBe("Développé couché");
    });

    it("devrait valider les données", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);
      vi.mocked(db.query.trainingSession.findFirst).mockResolvedValue(mockTrainingSession);

      const invalidExercise = {
        name: "", // Nom vide
        sets: 0, // Sets invalides
        reps: 100, // Reps trop élevées
        order: 1,
      };

      const request = new NextRequest("http://localhost:3000/api/sessions/session-123/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidExercise),
      });

      const response = await POST(request, { params: { sessionId: "session-123" } });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Données invalides");
    });
  });

  describe("GET /api/sessions/:sessionId/exercises", () => {
    it("devrait retourner la liste des exercices", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);
      
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          sets: 4,
          reps: 10,
          rpe: null,
          restSeconds: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          trainingSessionId: "session-123",
          order: 1,
        },
        {
          id: "ex-2",
          name: "Leg Press",
          sets: 3,
          reps: 12,
          rpe: null,
          restSeconds: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          trainingSessionId: "session-123",
          order: 2,
        },
      ];

      vi.mocked(db.query.exercise.findMany).mockResolvedValue(mockExercises);

      const request = new NextRequest("http://localhost:3000/api/sessions/session-123/exercises");
      const response = await GET(request, { params: { sessionId: "session-123" } });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.exercises).toHaveLength(2);
      expect(data.exercises[0].name).toBe("Squat");
    });
  });

  describe("DELETE /api/exercises/:exerciseId", () => {
    it("devrait supprimer un exercice", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(mockCoachSession);
      
      const mockExercise = {
        id: "ex-123",
        name: "Test Exercise",
        sets: 3,
        reps: 10,
        rpe: null,
        restSeconds: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        trainingSessionId: "session-123",
        order: 1,
      };

      vi.mocked(db.query.exercise.findFirst).mockResolvedValue(mockExercise);
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(true),
      } as any);

      const request = new NextRequest("http://localhost:3000/api/exercises/ex-123", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: { trainingSessionId: "ex-123" } });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});