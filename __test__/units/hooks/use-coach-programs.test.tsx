import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCoachPrograms } from "../../../src/hooks/use-coach-programs";

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock du refresh store
vi.mock("../../../../src/lib/refresh-store", () => ({
  useRefreshStore: {
    getState: () => ({
      getRefreshKey: vi.fn(() => "refresh-key"),
      triggerRefresh: vi.fn(),
    }),
  },
}));

describe("use-coach-programs hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCoachPrograms", () => {
    it("devrait récupérer les programmes du coach avec succès", async () => {
      // Arrange
      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force pour débutants",
          type: "Force" as const,
          level: "Débutant" as const,
          status: "published" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: "https://example.com/image.jpg",
          trainingSessions: [
            {
              id: "session-1",
              name: "Session Push",
              weekNumber: 1,
              dayNumber: 1,
              type: "Push",
              targetRPE: 7,
              duration: 60,
              notes: "Session de poussée",
              order: 1,
              programId: "prog-1",
              exercises: [],
            },
          ],
        },
        {
          id: "prog-2",
          name: "Programme Hypertrophie",
          description: "Programme d'hypertrophie pour intermédiaires",
          type: "Hypertrophie" as const,
          level: "Intermédiaire" as const,
          status: "draft" as const,
          durationWeeks: 12,
          sessionsPerWeek: 4,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: mockPrograms }),
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.programs).toEqual([]);
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.programs).toEqual(mockPrograms);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/coach/programs");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur réseau");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les réponses d'erreur HTTP", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des programmes");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait déclencher un refresh", () => {
      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      expect(typeof result.current.refetch).toBe("function");
    });

    it("devrait gérer les réponses avec des données vides", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: [] }),
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.programs).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les réponses avec des données partielles", async () => {
      // Arrange
      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force",
          type: "Force" as const,
          level: "Débutant" as const,
          status: "published" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: mockPrograms }),
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.programs).toEqual(mockPrograms);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les erreurs de parsing JSON", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Erreur de parsing JSON");
        },
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur de parsing JSON");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les erreurs réseau avec timeout", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Timeout"));

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Timeout");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les erreurs d'authentification", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des programmes");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les erreurs de permission", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des programmes");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les erreurs de serveur", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des programmes");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les erreurs de service indisponible", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des programmes");
      expect(result.current.programs).toEqual([]);
    });

    it("devrait gérer les programmes avec différents statuts", async () => {
      // Arrange
      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force",
          type: "Force" as const,
          level: "Débutant" as const,
          status: "published" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [],
        },
        {
          id: "prog-2",
          name: "Programme Hypertrophie",
          description: "Programme d'hypertrophie",
          type: "Hypertrophie" as const,
          level: "Intermédiaire" as const,
          status: "draft" as const,
          durationWeeks: 12,
          sessionsPerWeek: 4,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [],
        },
        {
          id: "prog-3",
          name: "Programme Endurance",
          description: "Programme d'endurance",
          type: "Endurance" as const,
          level: "Avancé" as const,
          status: "archived" as const,
          durationWeeks: 16,
          sessionsPerWeek: 5,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: mockPrograms }),
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.programs).toEqual(mockPrograms);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les programmes avec des sessions d'entraînement", async () => {
      // Arrange
      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force",
          type: "Force" as const,
          level: "Débutant" as const,
          status: "published" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
          trainingSessions: [
            {
              id: "session-1",
              name: "Session Push",
              weekNumber: 1,
              dayNumber: 1,
              type: "Push",
              targetRPE: 7,
              duration: 60,
              notes: "Session de poussée",
              order: 1,
              programId: "prog-1",
              exercises: [
                {
                  id: "ex-1",
                  name: "Squat",
                  sets: 3,
                  reps: 12,
                  rpe: 7,
                  restSeconds: 90,
                  notes: "Exercice de base",
                  order: 1,
                  trainingSessionId: "session-1",
                },
              ],
            },
          ],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: mockPrograms }),
      });

      // Act
      const { result } = renderHook(() => useCoachPrograms());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.programs).toEqual(mockPrograms);
      expect(result.current.error).toBeNull();
    });
  });
}); 