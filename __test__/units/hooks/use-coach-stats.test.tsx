// __test__/units/hooks/use-coach-stats.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCoachStats } from "../../../src/hooks/use-coach-stats";

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

describe("use-coach-stats hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCoachStats", () => {
    it("devrait récupérer les statistiques du coach avec succès", async () => {
      // Arrange
      const mockStats = {
        activeClients: 15,
        publishedPrograms: 8,
        totalSessions: 120,
        totalExercises: 450,
        completionRate: 85,
        publishRate: 60,
        sessionsThisMonth: 45,
        monthlyData: [
          { month: "Jan", clients: 10, programs: 5, sessions: 80 },
          { month: "Fév", clients: 12, programs: 6, sessions: 90 },
          { month: "Mar", clients: 15, programs: 8, sessions: 120 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stats: mockStats }),
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.stats).toBeNull();
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/coach/stats");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur réseau");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les réponses d'erreur HTTP", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des statistiques");
      expect(result.current.stats).toBeNull();
    });

    it("devrait déclencher un refresh", () => {
      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      expect(typeof result.current.refetch).toBe("function");
    });

    it("devrait gérer les réponses avec des données vides", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stats: null }),
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.stats).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les réponses avec des données partielles", async () => {
      // Arrange
      const mockStats = {
        activeClients: 10,
        publishedPrograms: 5,
        // Données partielles
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stats: mockStats }),
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockStats);
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
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur de parsing JSON");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les erreurs réseau avec timeout", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Timeout"));

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Timeout");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les erreurs d'authentification", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des statistiques");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les erreurs de permission", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des statistiques");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les erreurs de serveur", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des statistiques");
      expect(result.current.stats).toBeNull();
    });

    it("devrait gérer les erreurs de service indisponible", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      // Act
      const { result } = renderHook(() => useCoachStats());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des statistiques");
      expect(result.current.stats).toBeNull();
    });
  });
}); 