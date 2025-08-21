import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface AddFromLibraryInput {
  libraryExerciseId: string;
  sessionId: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  order: number;
}

// Hook pour ajouter un exercice depuis la bibliothèque
export function useAddExerciseFromLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      libraryExerciseId,
      sessionId,
      ...exerciseData
    }: AddFromLibraryInput) => {
      // D'abord, récupérer les détails de l'exercice depuis la bibliothèque
      const libraryResponse = await fetch(`/api/exercises/library?search=${libraryExerciseId}`);
      if (!libraryResponse.ok) {
        throw new Error("Exercice non trouvé dans la bibliothèque");
      }

      const { exercises } = await libraryResponse.json();
      const libraryExercise = exercises.find((ex: any) => ex.id === libraryExerciseId);

      if (!libraryExercise) {
        throw new Error("Exercice non trouvé");
      }

      // Ensuite, créer l'exercice dans la session
      const response = await fetch(`/api/sessions/${sessionId}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: libraryExercise.name,
          ...exerciseData,
          notes: libraryExercise.instructions, // Utiliser les instructions comme notes
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout");
      }

      return response.json();
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Exercice ajouté depuis la bibliothèque");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}