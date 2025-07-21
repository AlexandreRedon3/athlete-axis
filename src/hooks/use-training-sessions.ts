// src/hooks/use-sessions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateSessionInput {
  name: string;
  order: number;
  description?: string;
  programId: string;
}

interface UpdateSessionInput {
  name?: string;
  order?: number;
  description?: string;
}

// Hook pour ajouter une session à un programme
export function useCreateTrainingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSessionInput) => {
      const response = await fetch(`/api/programs/${input.programId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input.name,
          order: input.order,
          description: input.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout de la session");
      }

      return response.json();
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["programs", programId] });
      toast.success("Session ajoutée");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook pour modifier une session
export function useUpdateTrainingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      updates,
      programId,
    }: {
      sessionId: string;
      updates: UpdateSessionInput;
      programId: string;
    }) => {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      return { response: await response.json(), programId };
    },
    onSuccess: ({ programId }) => {
      queryClient.invalidateQueries({ queryKey: ["programs", programId] });
      toast.success("Session modifiée");
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });
}

// Hook pour supprimer une session
export function useDeleteTrainingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      programId 
    }: { 
      sessionId: string; 
      programId: string 
    }) => {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      return { sessionId, programId };
    },
    onSuccess: ({ programId }) => {
      queryClient.invalidateQueries({ queryKey: ["programs", programId] });
      toast.success("Session supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });
}