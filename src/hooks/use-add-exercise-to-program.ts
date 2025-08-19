"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddExerciseToProgram {
  // Exercice personnalisé
  programId: string;
  sessionId: string;
  exerciseType: "custom" | "library";
  name?: string;
  libraryExerciseId?: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  notes?: string;
}

export function useAddExerciseToProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddExerciseToProgram) => {
      const { exerciseType, sessionId, libraryExerciseId, ...exerciseData } = input;
      
      if (exerciseType === "library") {
        // Récupérer l'exercice depuis la bibliothèque
        const libraryResponse = await fetch(`/api/exercises/library?search=${libraryExerciseId}`);
        if (!libraryResponse.ok) {
          throw new Error("Exercice non trouvé dans la bibliothèque");
        }
        
        const { exercises } = await libraryResponse.json();
        const libraryExercise = exercises.find((ex: any) => ex.id === libraryExerciseId);
        
        if (!libraryExercise) {
          throw new Error("Exercice non trouvé");
        }

        // Créer l'exercice avec les données de la bibliothèque
        const response = await fetch(`/api/trainings/${sessionId}/exercises`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: libraryExercise.name,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            rpe: exerciseData.rpe,
            restSeconds: exerciseData.restSeconds,
            notes: exerciseData.notes || libraryExercise.instructions,
            order: 1 // Tu peux calculer l'ordre basé sur les exercices existants
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de l'ajout depuis la bibliothèque");
        }

        return response.json();
      } else {
        // Exercice personnalisé
        if (!exerciseData.name) {
          throw new Error("Le nom de l'exercice est requis");
        }

        const response = await fetch(`/api/trainings/${sessionId}/exercises`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: exerciseData.name,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            rpe: exerciseData.rpe,
            restSeconds: exerciseData.restSeconds,
            notes: exerciseData.notes,
            order: 1
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de l'ajout de l'exercice");
        }

        return response.json();
      }
    },
    onSuccess: (_, { sessionId, programId }) => {
      // Invalider les requêtes pour refréshir les données
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["programs", programId] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      
      toast.success("Exercice ajouté avec succès!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}