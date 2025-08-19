// src/hooks/use-programs.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
interface Program {
  id: string;
  name: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  coachId: string;
  trainingSessions?: TrainingSession[];
}

interface TrainingSession {
  id: string;
  name: string;
  order: number;
  description?: string;
  exercises?: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  order: number;
}

// Hook pour récupérer la liste des programmes
export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await fetch("/api/programs");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des programmes");
      }
      const data = await response.json();
      return data.programs as Program[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer un programme spécifique
export function useProgram(programId: string | null) {
  return useQuery({
    queryKey: ["programs", programId],
    queryFn: async () => {
      if (!programId) throw new Error("ID du programme requis");
      
      const response = await fetch(`/api/programs/${programId}`);
      if (!response.ok) {
        throw new Error("Programme non trouvé");
      }
      const data = await response.json();
      return data.program as Program;
    },
    enabled: !!programId, // Ne lance la requête que si programId existe
  });
}

// Hook pour créer un programme
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProgram: {
      name: string;
      durationWeeks: number;
      sessionsPerWeek: number;
    }) => {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProgram),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      const data = await response.json();
      return data.program as Program;
    },
    onSuccess: () => {
      // Invalider le cache pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Programme créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook pour modifier un programme
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programId,
      updates,
    }: {
      programId: string;
      updates: Partial<Program>;
    }) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Erreur de mise à jour");
      }

      const data = await response.json();
      return data.program as Program;
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["programs", programId] });
      toast.success("Programme mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur de mise à jour");
    },
  });
}

// Hook pour supprimer un programme
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programId: string) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Programme supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });
}