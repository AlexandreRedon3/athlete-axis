import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWorkoutLogs, useCreateWorkoutLog, useUpdateWorkoutLog } from "../../../src/hooks/use-workout-logs";
import { toast } from "sonner";

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Wrapper pour les tests avec QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("use-workout-logs hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useWorkoutLogs", () => {
    it("devrait récupérer les logs d'entraînement avec succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const mockLogs = [
        {
          id: "log-1",
          sessionId: "session-1",
          exerciseId: "ex-1",
          sets: [
            {
              setNumber: 1,
              weight: 100,
              reps: 12,
              rpe: 7,
              completed: true,
            },
          ],
          notes: "Bonne session",
          completedAt: new Date().toISOString(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ logs: mockLogs }),
      });

      // Act
      const { result } = renderHook(() => useWorkoutLogs(sessionId), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockLogs);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(`/api/trainings/${sessionId}/logs`);
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      const sessionId = "session-1";

      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useWorkoutLogs(sessionId), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it("ne devrait pas exécuter la requête si sessionId est null", () => {
      // Act
      const { result } = renderHook(() => useWorkoutLogs(null), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("useCreateWorkoutLog", () => {
    it("devrait créer un log d'entraînement avec succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const mockLogData = {
        exerciseId: "ex-1",
        sets: [
          {
            setNumber: 1,
            weight: 100,
            reps: 12,
            rpe: 7,
            completed: true,
          },
        ],
        notes: "Bonne session",
      };

      const mockResponse = {
        id: "log-1",
        sessionId,
        ...mockLogData,
        completedAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useCreateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync({
        sessionId,
        ...mockLogData,
      });

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/trainings/${sessionId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockLogData),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const mockLogData = {
        exerciseId: "ex-1",
        sets: [{ setNumber: 1, weight: 100, reps: 12, completed: true }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "log-1", ...mockLogData }),
      });

      // Act
      const { result } = renderHook(() => useCreateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        sessionId,
        ...mockLogData,
      });

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Log d'entraînement créé");
    });

    it("devrait gérer les erreurs lors de la création", async () => {
      // Arrange
      const sessionId = "session-1";
      const mockLogData = {
        exerciseId: "ex-1",
        sets: [{ setNumber: 1, weight: 100, reps: 12, completed: true }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de création" }),
      });

      // Act
      const { result } = renderHook(() => useCreateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(
        result.current.mutateAsync({
          sessionId,
          ...mockLogData,
        })
      ).rejects.toThrow("Erreur de création");

      expect(toast.error).toHaveBeenCalledWith("Erreur de création");
    });
  });

  describe("useUpdateWorkoutLog", () => {
    it("devrait mettre à jour un log d'entraînement avec succès", async () => {
      // Arrange
      const logId = "log-1";
      const mockUpdateData = {
        sets: [
          {
            setNumber: 1,
            weight: 110,
            reps: 10,
            rpe: 8,
            completed: true,
          },
        ],
        notes: "Session mise à jour",
      };

      const mockResponse = {
        id: logId,
        ...mockUpdateData,
        updatedAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useUpdateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync({
        logId,
        ...mockUpdateData,
      });

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/workout-logs/${logId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUpdateData),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const logId = "log-1";
      const mockUpdateData = {
        sets: [{ setNumber: 1, weight: 110, reps: 10, completed: true }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: logId, ...mockUpdateData }),
      });

      // Act
      const { result } = renderHook(() => useUpdateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        logId,
        ...mockUpdateData,
      });

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Log d'entraînement mis à jour");
    });

    it("devrait gérer les erreurs lors de la mise à jour", async () => {
      // Arrange
      const logId = "log-1";
      const mockUpdateData = {
        sets: [{ setNumber: 1, weight: 110, reps: 10, completed: true }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de mise à jour" }),
      });

      // Act
      const { result } = renderHook(() => useUpdateWorkoutLog(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(
        result.current.mutateAsync({
          logId,
          ...mockUpdateData,
        })
      ).rejects.toThrow("Erreur de mise à jour");

      expect(toast.error).toHaveBeenCalledWith("Erreur de mise à jour");
    });
  });
}); 