// __test__/units/hooks/use-program-sessions.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProgramSessions } from "../../../src/hooks/use-program-sessions";

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

describe("use-program-sessions hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useProgramSessions", () => {
    it("devrait récupérer les sessions d'un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockSessions = [
        {
          id: "session-1",
          name: "Session Push",
          weekNumber: 1,
          dayNumber: 1,
          type: "Push",
          targetRPE: 7,
          duration: 60,
          exercises: [],
          notes: "Session de poussée",
          exerciseCount: 5,
        },
      ];

      const mockProgress = {
        completedSessions: 3,
        totalSessions: 12,
        completionRate: 25,
        lastSessionDate: new Date().toISOString(),
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessions: mockSessions }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ progress: mockProgress }),
        });

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.sessions).toEqual([]);
      expect(result.current.clientProgress).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.clientProgress).toEqual(mockProgress);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}/sessions`);
    });

    it("devrait gérer les erreurs de récupération des sessions", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur réseau");
      expect(result.current.sessions).toEqual([]);
      expect(result.current.clientProgress).toBeNull();
    });

    it("devrait gérer les erreurs de récupération des exercices", async () => {
      // Arrange
      const programId = "prog-1";
      const mockSessions = [
        {
          id: "session-1",
          name: "Session Push",
          weekNumber: 1,
          dayNumber: 1,
          type: "Push",
          targetRPE: 7,
          duration: 60,
          exercises: [],
          notes: "Session de poussée",
          exerciseCount: 5,
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessions: mockSessions }),
        })
        .mockRejectedValueOnce(new Error("Erreur exercices"));

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les erreurs de récupération de la progression", async () => {
      // Arrange
      const programId = "prog-1";
      const mockSessions = [
        {
          id: "session-1",
          name: "Session Push",
          weekNumber: 1,
          dayNumber: 1,
          type: "Push",
          targetRPE: 7,
          duration: 60,
          exercises: [],
          notes: "Session de poussée",
          exerciseCount: 5,
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessions: mockSessions }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [] }),
        })
        .mockRejectedValueOnce(new Error("Erreur progression"));

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.clientProgress).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("ne devrait pas exécuter les requêtes si programId est null", () => {
      // Act
      const { result } = renderHook(() => useProgramSessions(null));

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.sessions).toEqual([]);
      expect(result.current.clientProgress).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("ne devrait pas exécuter les requêtes si programId est vide", () => {
      // Act
      const { result } = renderHook(() => useProgramSessions(""));

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.sessions).toEqual([]);
      expect(result.current.clientProgress).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("devrait transformer les données des sessions correctement", async () => {
      // Arrange
      const programId = "prog-1";
      const mockSessionsData = [
        {
          id: "session-1",
          name: "Session Push",
          order: 1,
          exercises: [],
          notes: "Session de poussée",
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessions: mockSessionsData }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ progress: null }),
        });

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions[0]).toEqual({
        id: "session-1",
        name: "Session Push",
        weekNumber: 1,
        dayNumber: 1,
        type: "Push",
        targetRPE: 7,
        duration: 60,
        exercises: [],
        notes: "Session de poussée",
        exerciseCount: 0,
      });
    });

    it("devrait déclencher un refresh", () => {
      // Act
      const { result } = renderHook(() => useProgramSessions("prog-1"));

      // Assert
      expect(typeof result.current.refetch).toBe("function");
    });

    it("devrait gérer les réponses d'erreur HTTP pour les sessions", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les réponses d'erreur HTTP pour les exercices", async () => {
      // Arrange
      const programId = "prog-1";
      const mockSessions = [
        {
          id: "session-1",
          name: "Session Push",
          weekNumber: 1,
          dayNumber: 1,
          type: "Push",
          targetRPE: 7,
          duration: 60,
          exercises: [],
          notes: "Session de poussée",
          exerciseCount: 5,
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sessions: mockSessions }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      // Act
      const { result } = renderHook(() => useProgramSessions(programId));

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.error).toBeNull();
    });
  });
}); 