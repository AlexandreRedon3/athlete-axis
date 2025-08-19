// __test__/units/hooks/use-exercises.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSessionExercises, useCreateExercise } from "../../../src/hooks/use-exercises";
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

describe("use-exercises hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useSessionExercises", () => {
    it("devrait récupérer les exercices d'une session avec succès", async () => {
      // Arrange
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          sets: 3,
          reps: 12,
          rpe: 7,
          restSeconds: 90,
          notes: "Notes du squat",
          order: 1,
          trainingSessionId: "session-1",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useSessionExercises("session-1"), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/sessions/session-1/exercises");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useSessionExercises("session-1"), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it("devrait gérer les réponses d'erreur HTTP", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act
      const { result } = renderHook(() => useSessionExercises("session-1"), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe("Erreur lors du chargement des exercices");
    });

    it("ne devrait pas exécuter la requête si sessionId est null", () => {
      // Act
      const { result } = renderHook(() => useSessionExercises(null), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("ne devrait pas exécuter la requête si sessionId est vide", () => {
      // Act
      const { result } = renderHook(() => useSessionExercises(""), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("useCreateExercise", () => {
    it("devrait créer un exercice avec succès", async () => {
      // Arrange
      const mockExerciseData = {
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        rpe: 7,
        restSeconds: 90,
        notes: "Notes",
        order: 1,
      };

      const mockResponse = {
        id: "ex-1",
        ...mockExerciseData,
        order: 1,
        trainingSessionId: "session-1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync(mockExerciseData);

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith("/api/sessions/session-1/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mockExerciseData.name,
          sets: mockExerciseData.sets,
          reps: mockExerciseData.reps,
          rpe: mockExerciseData.rpe,
          restSeconds: mockExerciseData.restSeconds,
          notes: mockExerciseData.notes,
          order: mockExerciseData.order,
        }),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const mockExerciseData = {
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        order: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "ex-1", ...mockExerciseData }),
      });

      // Act
      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(mockExerciseData);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Exercice ajouté");
    });

    it("devrait gérer les erreurs lors de la création", async () => {
      // Arrange
      const mockExerciseData = {
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        order: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de validation" }),
      });

      // Act
      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockExerciseData)).rejects.toThrow(
        "Erreur de validation"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de validation");
    });

    it("devrait gérer les erreurs réseau", async () => {
      // Arrange
      const mockExerciseData = {
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        order: 1,
      };

      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockExerciseData)).rejects.toThrow(
        "Erreur réseau"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur réseau");
    });

    it("devrait gérer les erreurs sans message", async () => {
      // Arrange
      const mockExerciseData = {
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        order: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      // Act
      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockExerciseData)).rejects.toThrow(
        "Erreur lors de l'ajout"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'ajout");
    });
  });
}); 