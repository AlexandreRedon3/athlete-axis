import { useQuery } from "@tanstack/react-query";

interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  instructions?: string;
  videoUrl?: string;
  imageUrl?: string;
}

interface UseExerciseLibraryOptions {
  search?: string;
  category?: string;
}

// Hook pour rechercher dans la bibliothèque d'exercices
export function useExerciseLibrary(options?: UseExerciseLibraryOptions) {
  const { search, category } = options || {};

  return useQuery({
    queryKey: ["exercise-library", { search, category }],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      
      const url = `/api/exercises/library${params.toString() ? `?${params}` : ""}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des exercices");
      }
      
      const data = await response.json();
      return data.exercises as ExerciseLibraryItem[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (la bibliothèque change rarement)
  });
}

// Hook pour obtenir les catégories disponibles
export function useExerciseCategories() {
  return useQuery({
    queryKey: ["exercise-categories"],
    queryFn: async () => {
      // Pour l'instant, on retourne les catégories en dur
      // Plus tard, on pourrait faire une vraie API
      return [
        { value: "push", label: "Poussée" },
        { value: "pull", label: "Tirage" },
        { value: "legs", label: "Jambes" },
        { value: "core", label: "Abdominaux" },
        { value: "arms", label: "Bras" },
        { value: "cardio", label: "Cardio" },
      ];
    },
    staleTime: Infinity, // Ne change jamais
  });
}