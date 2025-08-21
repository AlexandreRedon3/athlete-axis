import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePrograms, useProgram, useCreateProgram, useUpdateProgram } from "../../../src/hooks/use-programs";
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

describe("use-programs hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("usePrograms", () => {
    it("devrait récupérer tous les programmes avec succès", async () => {
      // Arrange
      const mockPrograms = [
        {
          id: "prog-1",
          name: "Programme Force",
          description: "Programme de force",
          type: "Force",
          level: "Débutant",
          status: "published" as const,
          durationWeeks: 8,
          sessionsPerWeek: 3,
          coachId: "coach-1",
          userId: "coach-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          imageUrl: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ programs: mockPrograms }),
      });

      // Act
      const { result } = renderHook(() => usePrograms(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockPrograms);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith("/api/programs");
    });

    it("devrait gérer les erreurs de récupération", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => usePrograms(), {
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
      const { result } = renderHook(() => usePrograms(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe("Erreur lors du chargement des programmes");
    });
  });

  describe("useProgram", () => {
    it("devrait récupérer un programme spécifique avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockProgram = {
        id: programId,
        name: "Programme Force",
        description: "Programme de force",
        type: "Force",
        level: "Débutant",
        status: "published" as const,
        durationWeeks: 8,
        sessionsPerWeek: 3,
        coachId: "coach-1",
        userId: "coach-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ program: mockProgram }),
      });

      // Act
      const { result } = renderHook(() => useProgram(programId), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProgram);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}`);
    });

    it("ne devrait pas exécuter la requête si programId est null", () => {
      // Act
      const { result } = renderHook(() => useProgram(null), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("ne devrait pas exécuter la requête si programId est vide", () => {
      // Act
      const { result } = renderHook(() => useProgram(""), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("useCreateProgram", () => {
    it("devrait créer un programme avec succès", async () => {
      // Arrange
      const mockProgramData = {
        name: "Nouveau Programme",
        description: "Description du programme",
        type: "Force" as const,
        level: "Débutant" as const,
        durationWeeks: 8,
        sessionsPerWeek: 3,
        imageUrl: "https://example.com/image.jpg",
      };

      const mockResponse = {
        id: "prog-1",
        ...mockProgramData,
        status: "draft" as const,
        coachId: "coach-1",
        userId: "coach-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ program: mockResponse }),
      });

      // Act
      const { result } = renderHook(() => useCreateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync(mockProgramData);

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProgramData),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const mockProgramData = {
        name: "Nouveau Programme",
        description: "Description",
        type: "Force" as const,
        level: "Débutant" as const,
        durationWeeks: 8,
        sessionsPerWeek: 3,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ program: { id: "prog-1", ...mockProgramData } }),
      });

      // Act
      const { result } = renderHook(() => useCreateProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(mockProgramData);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme créé avec succès");
    });

    it("devrait gérer les erreurs lors de la création", async () => {
      // Arrange
      const mockProgramData = {
        name: "Nouveau Programme",
        description: "Description",
        type: "Force" as const,
        level: "Débutant" as const,
        durationWeeks: 8,
        sessionsPerWeek: 3,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de validation" }),
      });

      // Act
      const { result } = renderHook(() => useCreateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockProgramData)).rejects.toThrow(
        "Erreur de validation"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de validation");
    });
  });

  describe("useUpdateProgram", () => {
    it("devrait mettre à jour un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Programme Mis à Jour",
        description: "Nouvelle description",
        type: "Hypertrophie" as const,
        level: "Intermédiaire" as const,
        durationWeeks: 12,
        sessionsPerWeek: 4,
      };

      const mockResponse = {
        id: programId,
        ...mockUpdateData,
        status: "published" as const,
        coachId: "coach-1",
        userId: "coach-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ program: mockResponse }),
      });

      // Act
      const { result } = renderHook(() => useUpdateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync({
        programId,
        updates: mockUpdateData,
      });

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUpdateData),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Programme Mis à Jour",
        description: "Nouvelle description",
        type: "Hypertrophie" as const,
        level: "Intermédiaire" as const,
        durationWeeks: 12,
        sessionsPerWeek: 4,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ program: { id: programId, ...mockUpdateData } }),
      });

      // Act
      const { result } = renderHook(() => useUpdateProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        programId,
        updates: mockUpdateData,
      });

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme mis à jour avec succès");
    });

    it("devrait gérer les erreurs lors de la mise à jour", async () => {
      // Arrange
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Programme Mis à Jour",
        description: "Nouvelle description",
        type: "Hypertrophie" as const,
        level: "Intermédiaire" as const,
        durationWeeks: 12,
        sessionsPerWeek: 4,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de mise à jour" }),
      });

      // Act
      const { result } = renderHook(() => useUpdateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(
        result.current.mutateAsync({
          programId,
          updates: mockUpdateData,
        })
      ).rejects.toThrow("Erreur de mise à jour");

      expect(toast.error).toHaveBeenCalledWith("Erreur de mise à jour");
    });
  });
});