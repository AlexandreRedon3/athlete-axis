// src/hooks/use-workout-logs.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface WorkoutSet {
  setNumber: number;
  weight?: number;
  reps: number;
  rpe?: number;
  completed: boolean;
}

interface WorkoutLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
  completedAt?: string;
  updatedAt?: string;
}

interface CreateWorkoutLogInput {
  sessionId: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

interface UpdateWorkoutLogInput {
  logId: string;
  sets?: WorkoutSet[];
  notes?: string;
}

// Hook pour récupérer les logs d'entraînement d'une session
export function useWorkoutLogs(sessionId: string | null) {
  return useQuery({
    queryKey: ["workout-logs", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID requis");
      
      const response = await fetch(`/api/trainings/${sessionId}/logs`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des logs");
      }
      
      const data = await response.json();
      return data.logs as WorkoutLog[];
    },
    enabled: !!sessionId,
  });
}

// Hook pour créer un log d'entraînement
export function useCreateWorkoutLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, ...logData }: CreateWorkoutLogInput) => {
      const response = await fetch(`/api/trainings/${sessionId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      return response.json();
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["workout-logs", sessionId] });
      toast.success("Log d'entraînement créé");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook pour mettre à jour un log d'entraînement
export function useUpdateWorkoutLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ logId, ...updateData }: UpdateWorkoutLogInput) => {
      const response = await fetch(`/api/workout-logs/${logId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise à jour");
      }

      return response.json();
    },
    onSuccess: (_, { logId }) => {
      queryClient.invalidateQueries({ queryKey: ["workout-logs"] });
      toast.success("Log d'entraînement mis à jour");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
