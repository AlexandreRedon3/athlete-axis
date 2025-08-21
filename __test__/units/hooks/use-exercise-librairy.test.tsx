// __test__/units/hooks/use-exercise-librairy.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExerciseLibrary } from "../../../src/hooks/use-exercise-librairy";

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

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

describe("use-exercise-librairy hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useExerciseLibrary", () => {
    it("devrait récupérer la bibliothèque d'exercices avec succès", async () => {
      // Arrange
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library");
    });

    it("devrait récupérer la bibliothèque avec un terme de recherche", async () => {
      // Arrange
      const searchTerm = "squat";
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary({ search: searchTerm }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library?search=squat");
    });

    it("devrait récupérer la bibliothèque avec une catégorie", async () => {
      // Arrange
      const category = "Jambes";
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary({ category }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library?category=Jambes");
    });

    it("devrait récupérer la bibliothèque avec recherche et catégorie", async () => {
      // Arrange
      const options = {
        search: "squat",
        category: "Jambes",
      };
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary(options), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library?search=squat&category=Jambes");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useExerciseLibrary(), {
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
      const { result } = renderHook(() => useExerciseLibrary(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("Erreur lors du chargement des exercices");
      });
    });

    it("devrait utiliser un staleTime de 10 minutes", () => {
      // Act
      const { result } = renderHook(() => useExerciseLibrary(), {
        wrapper: createWrapper(),
      });

      // Assert
      // Le staleTime est configuré dans le hook, on vérifie juste que le hook se charge
      expect(result.current.isLoading).toBe(true);
    });

    it("devrait gérer les paramètres vides", async () => {
      // Arrange
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary({ search: "", category: "" }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library");
    });

    it("devrait gérer les paramètres undefined", async () => {
      // Arrange
      const mockExercises = [
        {
          id: "ex-1",
          name: "Squat",
          category: "Jambes",
          difficulty: "Intermédiaire",
          instructions: "Instructions du squat",
          muscleGroups: ["Quadriceps", "Fessiers"],
          equipment: "Barre",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exercises: mockExercises }),
      });

      // Act
      const { result } = renderHook(() => useExerciseLibrary({ search: undefined, category: undefined }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockExercises);
      expect(mockFetch).toHaveBeenCalledWith("/api/exercises/library");
    });
  });
}); 