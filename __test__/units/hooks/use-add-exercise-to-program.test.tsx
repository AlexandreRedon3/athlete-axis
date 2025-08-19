// __test__/units/hooks/use-add-exercise-to-program.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddExerciseToProgram } from "../../../src/hooks/use-add-exercise-to-program";
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

describe("use-add-exercise-to-program hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useAddExerciseToProgram", () => {
    it("devrait ajouter un exercice personnalisé avec succès", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "custom" as const,
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
        rpe: 7,
        restSeconds: 90,
        notes: "Notes de l'exercice",
      };

      const mockResponse = {
        id: "ex-1",
        ...mockInput,
        order: 1,
        trainingSessionId: "session-1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync(mockInput);

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith("/api/trainings/session-1/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mockInput.name,
          sets: mockInput.sets,
          reps: mockInput.reps,
          rpe: mockInput.rpe,
          restSeconds: mockInput.restSeconds,
          notes: mockInput.notes,
          order: 1,
        }),
      });
    });

    it("devrait ajouter un exercice depuis la bibliothèque avec succès", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "library" as const,
        sessionId: "session-1",
        libraryExerciseId: "lib-ex-1",
        sets: 3,
        reps: 12,
        rpe: 7,
        restSeconds: 90,
        notes: "Notes de l'exercice",
      };

      const mockLibraryExercise = {
        id: "lib-ex-1",
        name: "Squat",
        instructions: "Instructions du squat",
      };

      const mockResponse = {
        id: "ex-1",
        name: "Squat",
        sets: 3,
        reps: 12,
        rpe: 7,
        restSeconds: 90,
        notes: "Instructions du squat",
        order: 1,
        trainingSessionId: "session-1",
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [mockLibraryExercise] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      const addPromise = result.current.mutateAsync(mockInput);

      const response = await addPromise;

      expect(response).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library?search=lib-ex-1");
      expect(mockFetch).toHaveBeenCalledWith("/api/trainings/session-1/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Squat",
          sets: 3,
          reps: 12,
          rpe: 7,
          restSeconds: 90,
          notes: "Notes de l'exercice",
          order: 1,
        }),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "custom" as const,
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "ex-1", ...mockInput }),
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(mockInput);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Exercice ajouté avec succès!");
    });

    it("devrait gérer les erreurs lors de l'ajout d'un exercice personnalisé", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "custom" as const,
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de validation" }),
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Erreur de validation"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de validation");
    });

    it("devrait gérer les erreurs lors de la récupération depuis la bibliothèque", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "library" as const,
        sessionId: "session-1",
        libraryExerciseId: "lib-ex-1",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Exercice non trouvé" }),
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Exercice non trouvé"
      );

      expect(toast.error).toHaveBeenCalledWith("Exercice non trouvé dans la bibliothèque");
    });

    it("devrait gérer les erreurs lors de l'ajout depuis la bibliothèque", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "library" as const,
        sessionId: "session-1",
        libraryExerciseId: "lib-ex-1",
        sets: 3,
        reps: 12,
      };

      const mockLibraryExercise = {
        id: "lib-ex-1",
        name: "Squat",
        instructions: "Instructions du squat",
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [mockLibraryExercise] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: "Erreur lors de l'ajout" }),
        });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Erreur lors de l'ajout"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'ajout");
    });

    it("devrait gérer les erreurs réseau", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "custom" as const,
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Erreur réseau"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur réseau");
    });

    it("devrait gérer les erreurs sans message", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "custom" as const,
        sessionId: "session-1",
        name: "Nouvel exercice",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Erreur lors de l'ajout"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'ajout de l'exercice");
    });

    it("devrait gérer les erreurs de la bibliothèque sans message", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "library" as const,
        sessionId: "session-1",
        libraryExerciseId: "lib-ex-1",
        sets: 3,
        reps: 12,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Exercice non trouvé dans la bibliothèque"
      );

      expect(toast.error).toHaveBeenCalledWith("Exercice non trouvé dans la bibliothèque");
    });

    it("devrait gérer les erreurs de la bibliothèque sans message lors de l'ajout", async () => {
      // Arrange
      const mockInput = {
        programId: "program-1",
        exerciseType: "library" as const,
        sessionId: "session-1",
        libraryExerciseId: "lib-ex-1",
        sets: 3,
        reps: 12,
      };

      const mockLibraryExercise = {
        id: "lib-ex-1",
        name: "Squat",
        instructions: "Instructions du squat",
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ exercises: [mockLibraryExercise] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({}),
        });

      // Act
      const { result } = renderHook(() => useAddExerciseToProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockInput)).rejects.toThrow(
        "Erreur lors de l'ajout depuis la bibliothèque"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'ajout depuis la bibliothèque");
    });
  });
}); 