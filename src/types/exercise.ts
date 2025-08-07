// src/types/exercise.ts

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    rpe?: number;
    restSeconds?: number;
    notes?: string;
    order: number;
    trainingSessionId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ExerciseLibraryItem {
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
  
  export interface CreateExerciseInput {
    name: string;
    sets: number;
    reps: number;
    rpe?: number;
    restSeconds?: number;
    notes?: string;
    order?: number; // Sera calculé automatiquement si pas fourni
  }
  
  export interface AddExerciseToProgram {
    programId: string;
    sessionId: string;
    exerciseType: 'custom' | 'library';
    // Pour exercice personnalisé
    name?: string;
    // Pour exercice depuis la bibliothèque
    libraryExerciseId?: string;
    // Paramètres communs
    sets: number;
    reps: number;
    rpe?: number;
    restSeconds?: number;
    notes?: string;
  }
  
  export interface AddExerciseFormData {
    programId: string;
    sessionId: string;
    exerciseType: 'custom' | 'library';
    name: string;
    libraryExerciseId: string;
    sets: number;
    reps: number;
    rpe: number;
    restSeconds: number;
    notes: string;
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }