// __test__/units/hooks/use-today-sessions.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTodaySessions } from "../../../src/hooks/use-today-sessions";

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

describe("use-today-sessions hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useTodaySessions", () => {
    it("devrait récupérer les sessions du jour avec succès", async () => {
      // Arrange
      const mockSessions = [
        {
          id: "session-1",
          client: {
            id: "client-1",
            name: "Jean Dupont",
            email: "jean@example.com",
            image: "https://example.com/avatar.jpg",
          },
          type: "Push",
          time: "09:00",
          status: "scheduled" as const,
          program: {
            id: "prog-1",
            name: "Programme Force",
          },
        },
        {
          id: "session-2",
          client: {
            id: "client-2",
            name: "Marie Martin",
            email: "marie@example.com",
            image: null,
          },
          type: "Pull",
          time: "14:00",
          status: "completed" as const,
          program: {
            id: "prog-2",
            name: "Programme Hypertrophie",
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.sessions).toEqual([]);
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/coach/today-sessions");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur réseau");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les réponses d'erreur HTTP", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions du jour");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait déclencher un refresh", () => {
      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      expect(typeof result.current.refetch).toBe("function");
    });

    it("devrait gérer les réponses avec des données vides", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: [] }),
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les réponses avec des données partielles", async () => {
      // Arrange
      const mockSessions = [
        {
          id: "session-1",
          client: {
            id: "client-1",
            name: "Jean Dupont",
            email: "jean@example.com",
            // Données partielles
          },
          type: "Push",
          time: "09:00",
          status: "scheduled" as const,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
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
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur de parsing JSON");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les erreurs réseau avec timeout", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Timeout"));

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Timeout");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les erreurs d'authentification", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions du jour");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les erreurs de permission", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions du jour");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les erreurs de serveur", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions du jour");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les erreurs de service indisponible", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des sessions du jour");
      expect(result.current.sessions).toEqual([]);
    });

    it("devrait gérer les sessions avec différents statuts", async () => {
      // Arrange
      const mockSessions = [
        {
          id: "session-1",
          client: {
            id: "client-1",
            name: "Jean Dupont",
            email: "jean@example.com",
            image: null,
          },
          type: "Push",
          time: "09:00",
          status: "scheduled" as const,
          program: {
            id: "prog-1",
            name: "Programme Force",
          },
        },
        {
          id: "session-2",
          client: {
            id: "client-2",
            name: "Marie Martin",
            email: "marie@example.com",
            image: null,
          },
          type: "Pull",
          time: "14:00",
          status: "completed" as const,
          program: {
            id: "prog-2",
            name: "Programme Hypertrophie",
          },
        },
        {
          id: "session-3",
          client: {
            id: "client-3",
            name: "Pierre Durand",
            email: "pierre@example.com",
            image: null,
          },
          type: "Legs",
          time: "16:00",
          status: "cancelled" as const,
          program: {
            id: "prog-3",
            name: "Programme Jambes",
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les sessions sans programme", async () => {
      // Arrange
      const mockSessions = [
        {
          id: "session-1",
          client: {
            id: "client-1",
            name: "Jean Dupont",
            email: "jean@example.com",
            image: null,
          },
          type: "Push",
          time: "09:00",
          status: "scheduled" as const,
          program: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessions: mockSessions }),
      });

      // Act
      const { result } = renderHook(() => useTodaySessions());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.error).toBeNull();
    });
  });
}); 