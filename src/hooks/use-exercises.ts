// src/hooks/use-exercises.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  notes?: string;
  order: number;
  trainingSessionId: string;
}

interface CreateExerciseInput {
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  notes?: string;
  order: number;
  sessionId: string;
}

// Hook pour récupérer les exercices d'une session
export function useSessionExercises(sessionId: string | null) {
  return useQuery({
    queryKey: ["exercises", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID requis");
      
      const response = await fetch(`/api/sessions/${sessionId}/exercises`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des exercices");
      }
      
      const data = await response.json();
      return data.exercises as Exercise[];
    },
    enabled: !!sessionId,
  });
}

// Hook pour ajouter un exercice
export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, ...exerciseData }: CreateExerciseInput) => {
      const response = await fetch(`/api/sessions/${sessionId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout");
      }

      return response.json();
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
      // Invalider aussi le programme pour mettre à jour le compteur
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Exercice ajouté");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook pour modifier un exercice
export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseId,
      sessionId,
      updates,
    }: {
      exerciseId: string;
      sessionId: string;
      updates: Partial<Exercise>;
    }) => {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      return { data: await response.json(), sessionId };
    },
    onSuccess: ({ sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
      toast.success("Exercice modifié");
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });
}

// Hook pour supprimer un exercice
export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseId,
      sessionId,
    }: {
      exerciseId: string;
      sessionId: string;
    }) => {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      return { exerciseId, sessionId };
    },
    onSuccess: ({ sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
      toast.success("Exercice supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });
}

// Hook pour réorganiser les exercices
export function useReorderExercises() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      exercises,
    }: {
      sessionId: string;
      exercises: { id: string; order: number }[];
    }) => {
      // Pour l'instant, on met à jour un par un
      // Plus tard, on pourrait faire une route spécifique
      const promises = exercises.map((ex) =>
        fetch(`/api/exercises/${ex.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order: ex.order }),
        })
      );

      await Promise.all(promises);
      return sessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
    },
  });
}