// __tests__/hooks/use-programs.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePrograms, useCreateProgram, useDeleteProgram } from "@/hooks/use-programs";
import { ReactNode } from "react";
import React from "react";


// Mock de sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Wrapper pour React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Désactiver les retry pour les tests
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePrograms hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("devrait charger la liste des programmes", async () => {
    // Arrange
    const mockPrograms = [
      {
        id: "1",
        name: "Programme Test",
        durationWeeks: 8,
        sessionsPerWeek: 3,
        coachId: "coach-1",
      },
    ];

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ programs: mockPrograms }),
    } as Response);

    // Act
    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper(),
    });

    // Assert - État initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Assert - Après chargement
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPrograms);
    expect(global.fetch).toHaveBeenCalledWith("/api/programs");
  });

  it("devrait gérer les erreurs de chargement", async () => {
    // Arrange
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur serveur" }),
    } as Response);

    // Act
    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Erreur lors du chargement des programmes");
  });
});

describe("useCreateProgram hook", () => {
  it("devrait créer un programme avec succès", async () => {
    // Arrange
    const newProgram = {
      name: "Nouveau Programme",
      durationWeeks: 12,
      sessionsPerWeek: 4,
    };

    const mockResponse = {
      id: "new-id",
      ...newProgram,
      coachId: "coach-1",
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ program: mockResponse }),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Act
    const { result } = renderHook(() => useCreateProgram(), { wrapper });

    await result.current.mutateAsync(newProgram);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProgram),
    });
  });
});

describe("useDeleteProgram hook", () => {
  it("devrait supprimer un programme", async () => {
    // Arrange
    const programId = "prog-123";

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    // Act
    const { result } = renderHook(() => useDeleteProgram(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(programId);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(`/api/programs/${programId}`, {
      method: "DELETE",
    });
  });
});