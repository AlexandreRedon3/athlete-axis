// __test__/units/hooks/use-coach-clients.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCoachClients } from "../../../src/hooks/use-coach-client";

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

describe("use-coach-clients hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCoachClients", () => {
    it("devrait récupérer les clients du coach avec succès", async () => {
      // Arrange
      const mockClients = [
        {
          id: "client-1",
          name: "Jean Dupont",
          email: "jean@example.com",
          image: "https://example.com/avatar.jpg",
          isActive: true,
          lastSessionDate: new Date().toISOString(),
          totalSessions: 15,
          completionRate: 85,
          assignedPrograms: [
            {
              id: "prog-1",
              name: "Programme Force",
              status: "active",
            },
          ],
        },
        {
          id: "client-2",
          name: "Marie Martin",
          email: "marie@example.com",
          image: null,
          isActive: true,
          lastSessionDate: new Date().toISOString(),
          totalSessions: 8,
          completionRate: 75,
          assignedPrograms: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.clients).toEqual([]);
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.clients).toEqual(mockClients);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/coach/clients");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur réseau");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les réponses d'erreur HTTP", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des clients");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait déclencher un refresh", () => {
      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      expect(typeof result.current.refetch).toBe("function");
    });

    it("devrait gérer les réponses avec des données vides", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: [] }),
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.clients).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les réponses avec des données partielles", async () => {
      // Arrange
      const mockClients = [
        {
          id: "client-1",
          name: "Jean Dupont",
          email: "jean@example.com",
          // Données partielles
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.clients).toEqual(mockClients);
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
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur de parsing JSON");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les erreurs réseau avec timeout", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Timeout"));

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Timeout");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les erreurs d'authentification", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des clients");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les erreurs de permission", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des clients");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les erreurs de serveur", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des clients");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les erreurs de service indisponible", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Erreur lors du chargement des clients");
      expect(result.current.clients).toEqual([]);
    });

    it("devrait gérer les clients avec des images null", async () => {
      // Arrange
      const mockClients = [
        {
          id: "client-1",
          name: "Jean Dupont",
          email: "jean@example.com",
          image: null,
          isActive: true,
          lastSessionDate: new Date().toISOString(),
          totalSessions: 15,
          completionRate: 85,
          assignedPrograms: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.clients).toEqual(mockClients);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les clients inactifs", async () => {
      // Arrange
      const mockClients = [
        {
          id: "client-1",
          name: "Jean Dupont",
          email: "jean@example.com",
          image: null,
          isActive: false,
          lastSessionDate: null,
          totalSessions: 0,
          completionRate: 0,
          assignedPrograms: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clients: mockClients }),
      });

      // Act
      const { result } = renderHook(() => useCoachClients());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.clients).toEqual(mockClients);
      expect(result.current.error).toBeNull();
    });
  });
}); 