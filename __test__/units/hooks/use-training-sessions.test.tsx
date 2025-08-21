// __test__/units/hooks/use-training-sessions.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateTrainingSession, useUpdateTrainingSession, useDeleteTrainingSession } from "../../../src/hooks/use-training-sessions";
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

describe("use-training-sessions hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCreateTrainingSession", () => {
    it("devrait créer une session d'entraînement avec succès", async () => {
      // Arrange
      const mockSessionData = {
        programId: "prog-1",
        name: "Nouvelle Session",
        order: 1,
        description: "Notes de la session",
      };

      const mockResponse = {
        id: "session-1",
        ...mockSessionData,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useCreateTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync(mockSessionData);

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/programs/${mockSessionData.programId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mockSessionData.name,
          order: mockSessionData.order,
          description: mockSessionData.description,
        }),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const mockSessionData = {
        programId: "prog-1",
        name: "Nouvelle Session",
        order: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "session-1", ...mockSessionData }),
      });

      // Act
      const { result } = renderHook(() => useCreateTrainingSession(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(mockSessionData);

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Session ajoutée");
    });

    it("devrait gérer les erreurs lors de la création", async () => {
      // Arrange
      const mockSessionData = {
        programId: "prog-1",
        name: "Nouvelle Session",
        order: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de validation" }),
      });

      // Act
      const { result } = renderHook(() => useCreateTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync(mockSessionData)).rejects.toThrow(
        "Erreur de validation"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur de validation");
    });
  });

  describe("useUpdateTrainingSession", () => {
    it("devrait mettre à jour une session d'entraînement avec succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Session Mis à Jour",
        order: 2,
        description: "Nouvelles notes",
      };

      const mockResponse = {
        id: sessionId,
        ...mockUpdateData,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useUpdateTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const updatePromise = result.current.mutateAsync({
        sessionId,
        updates: mockUpdateData,
        programId,
      });

      const response = await updatePromise;

      expect(response).toEqual({ response: mockResponse, programId });
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUpdateData),
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Session Mis à Jour",
        order: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: sessionId, ...mockUpdateData }),
      });

      // Act
      const { result } = renderHook(() => useUpdateTrainingSession(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        sessionId,
        updates: mockUpdateData,
        programId,
      });

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Session modifiée");
    });

    it("devrait gérer les erreurs lors de la mise à jour", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";
      const mockUpdateData = {
        name: "Session Mis à Jour",
        order: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de mise à jour" }),
      });

      // Act
      const { result } = renderHook(() => useUpdateTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(
        result.current.mutateAsync({
          sessionId,
          updates: mockUpdateData,
          programId,
        })
      ).rejects.toThrow("Erreur lors de la modification");

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de la modification");
    });
  });

  describe("useDeleteTrainingSession", () => {
    it("devrait supprimer une session d'entraînement avec succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";
      const mockResponse = { sessionId, programId };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const { result } = renderHook(() => useDeleteTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isPending).toBe(false);

      const response = await result.current.mutateAsync({ sessionId, programId });

      expect(response).toEqual(mockResponse);
      expect(result.current.isPending).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
    });

    it("devrait afficher un toast de succès", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId, programId }),
      });

      // Act
      const { result } = renderHook(() => useDeleteTrainingSession(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({ sessionId, programId });

      // Assert
      expect(toast.success).toHaveBeenCalledWith("Session supprimée");
    });

    it("devrait gérer les erreurs lors de la suppression", async () => {
      // Arrange
      const sessionId = "session-1";
      const programId = "prog-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Erreur de suppression" }),
      });

      // Act
      const { result } = renderHook(() => useDeleteTrainingSession(), {
        wrapper: createWrapper(),
      });

      // Assert
      await expect(result.current.mutateAsync({ sessionId, programId })).rejects.toThrow(
        "Erreur lors de la suppression"
      );

      expect(toast.error).toHaveBeenCalledWith("Erreur lors de la suppression");
    });
  });
}); 