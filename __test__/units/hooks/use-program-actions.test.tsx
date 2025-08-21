// __test__/units/hooks/use-program-actions.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteProgram, useDuplicateProgram, usePublishProgram } from "../../../src/hooks/use-program-actions";
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

describe("use-program-actions hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useDeleteProgram", () => {
    it("devrait supprimer un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useDeleteProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isDeleting).toBe(false);

      const response = await result.current.deleteProgram(programId);

      expect(response).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}`, {
        method: "DELETE",
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Act
      const { result } = renderHook(() => useDeleteProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteProgram(programId);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme supprimé");
    });

    it("devrait gérer les erreurs lors de la suppression", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de suppression" }),
      });

      // Act
      const { result } = renderHook(() => useDeleteProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.deleteProgram(programId)).rejects.toThrow(
        "Erreur de suppression"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de suppression");
    });

    it("devrait gérer les erreurs réseau", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockRejectedValueOnce(new Error("Erreur réseau"));

      // Act
      const { result } = renderHook(() => useDeleteProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.deleteProgram(programId)).rejects.toThrow(
        "Erreur réseau"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur réseau");
    });
  });

  describe("useDuplicateProgram", () => {
    it("devrait dupliquer un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockResponse = {
        id: "prog-2",
        name: "Programme Force (Copie)",
        description: "Copie du programme",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useDuplicateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isDuplicating).toBe(false);

      const response = await result.current.duplicateProgram(programId);

      expect(response).toEqual(mockResponse);
              expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}`, {
          method: "POST",
        });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "prog-2", name: "Copie" }),
      });

      // Act
      const { result } = renderHook(() => useDuplicateProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.duplicateProgram(programId);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme dupliqué");
    });

    it("devrait gérer les erreurs lors de la duplication", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de duplication" }),
      });

      // Act
      const { result } = renderHook(() => useDuplicateProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.duplicateProgram(programId)).rejects.toThrow(
        "Erreur de duplication"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de duplication");
    });
  });

  describe("usePublishProgram", () => {
    it("devrait publier un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockResponse = {
        id: programId,
        status: "published",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPublishing).toBe(false);

      const response = await result.current.publishProgram(programId);

      expect(response).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}/publish`, {
        method: "POST",
      });
    });

    it("devrait afficher un toast de succès pour la publication", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: programId, status: "published" }),
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.publishProgram(programId);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme publié");
    });

    it("devrait dépublier un programme avec succès", async () => {
      // Arrange
      const programId = "prog-1";
      const mockResponse = {
        id: programId,
        status: "draft",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isUnpublishing).toBe(false);

      const response = await result.current.unpublishProgram(programId);

      expect(response).toEqual(mockResponse);
              expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${programId}/publish`, {
          method: "DELETE",
        });
    });

    it("devrait afficher un toast de succès pour la dépublication", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: programId, status: "draft" }),
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      await result.current.unpublishProgram(programId);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Programme retiré de la publication");
    });

    it("devrait gérer les erreurs lors de la publication", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de publication" }),
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.publishProgram(programId)).rejects.toThrow(
        "Erreur de publication"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de publication");
    });

    it("devrait gérer les erreurs lors de la dépublication", async () => {
      // Arrange
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de dépublication" }),
      });

      // Act
      const { result } = renderHook(() => usePublishProgram(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.unpublishProgram(programId)).rejects.toThrow(
        "Erreur de dépublication"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de dépublication");
    });
  });
}); 