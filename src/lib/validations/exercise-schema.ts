
import { AddExerciseFormData, ValidationError,ValidationResult } from '@/types/exercise';

export function validateAddExerciseForm(data: Partial<AddExerciseFormData>): ValidationResult {
  const errors: ValidationError[] = [];

  // Validation du programme
  if (!data.programId || data.programId.trim() === '') {
    errors.push({
      field: 'programId',
      message: 'Veuillez sélectionner un programme'
    });
  }

  // Validation de la session
  if (!data.sessionId || data.sessionId.trim() === '') {
    errors.push({
      field: 'sessionId',
      message: 'Veuillez sélectionner une session'
    });
  }

  // Validation du type d'exercice
  if (!data.exerciseType || !['custom', 'library'].includes(data.exerciseType)) {
    errors.push({
      field: 'exerciseType',
      message: 'Veuillez choisir un type d\'exercice'
    });
  }

  // Validation selon le type d'exercice
  if (data.exerciseType === 'custom') {
    if (!data.name || data.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Le nom de l\'exercice est requis pour un exercice personnalisé'
      });
    } else if (data.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Le nom ne peut pas dépasser 100 caractères'
      });
    }
  }

  if (data.exerciseType === 'library') {
    if (!data.libraryExerciseId || data.libraryExerciseId.trim() === '') {
      errors.push({
        field: 'libraryExerciseId',
        message: 'Veuillez sélectionner un exercice de la bibliothèque'
      });
    }
  }

  // Validation des séries
  if (data.sets === undefined || data.sets === null) {
    errors.push({
      field: 'sets',
      message: 'Le nombre de séries est requis'
    });
  } else if (!Number.isInteger(data.sets) || data.sets < 1 || data.sets > 10) {
    errors.push({
      field: 'sets',
      message: 'Le nombre de séries doit être entre 1 et 10'
    });
  }

  // Validation des répétitions
  if (data.reps === undefined || data.reps === null) {
    errors.push({
      field: 'reps',
      message: 'Le nombre de répétitions est requis'
    });
  } else if (!Number.isInteger(data.reps) || data.reps < 1 || data.reps > 100) {
    errors.push({
      field: 'reps',
      message: 'Le nombre de répétitions doit être entre 1 et 100'
    });
  }

  // Validation du RPE (optionnel)
  if (data.rpe !== undefined && data.rpe !== null) {
    if (!Number.isInteger(data.rpe) || data.rpe < 1 || data.rpe > 10) {
      errors.push({
        field: 'rpe',
        message: 'Le RPE doit être entre 1 et 10'
      });
    }
  }

  // Validation du temps de repos (optionnel)
  if (data.restSeconds !== undefined && data.restSeconds !== null) {
    if (!Number.isInteger(data.restSeconds) || data.restSeconds < 0 || data.restSeconds > 600) {
      errors.push({
        field: 'restSeconds',
        message: 'Le temps de repos doit être entre 0 et 600 secondes'
      });
    }
  }

  // Validation des notes (optionnel)
  if (data.notes && data.notes.length > 500) {
    errors.push({
      field: 'notes',
      message: 'Les notes ne peuvent pas dépasser 500 caractères'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCreateExercise(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  // Validation du nom
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Le nom de l\'exercice est requis'
    });
  } else if (data.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Le nom ne peut pas dépasser 100 caractères'
    });
  }

  // Validation des séries
  if (typeof data.sets !== 'number' || !Number.isInteger(data.sets) || data.sets < 1 || data.sets > 10) {
    errors.push({
      field: 'sets',
      message: 'Le nombre de séries doit être un entier entre 1 et 10'
    });
  }

  // Validation des répétitions
  if (typeof data.reps !== 'number' || !Number.isInteger(data.reps) || data.reps < 1 || data.reps > 100) {
    errors.push({
      field: 'reps',
      message: 'Le nombre de répétitions doit être un entier entre 1 et 100'
    });
  }

  // Validation du RPE (optionnel)
  if (data.rpe !== undefined && data.rpe !== null) {
    if (typeof data.rpe !== 'number' || !Number.isInteger(data.rpe) || data.rpe < 1 || data.rpe > 10) {
      errors.push({
        field: 'rpe',
        message: 'Le RPE doit être un entier entre 1 et 10'
      });
    }
  }

  // Validation du temps de repos (optionnel)
  if (data.restSeconds !== undefined && data.restSeconds !== null) {
    if (typeof data.restSeconds !== 'number' || !Number.isInteger(data.restSeconds) || data.restSeconds < 0 || data.restSeconds > 600) {
      errors.push({
        field: 'restSeconds',
        message: 'Le temps de repos doit être un entier entre 0 et 600 secondes'
      });
    }
  }

  // Validation de l'ordre (optionnel)
  if (data.order !== undefined && data.order !== null) {
    if (typeof data.order !== 'number' || !Number.isInteger(data.order) || data.order < 1) {
      errors.push({
        field: 'order',
        message: 'L\'ordre doit être un entier positif'
      });
    }
  }

  // Validation des notes (optionnel)
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== 'string') {
      errors.push({
        field: 'notes',
        message: 'Les notes doivent être du texte'
      });
    } else if (data.notes.length > 500) {
      errors.push({
        field: 'notes',
        message: 'Les notes ne peuvent pas dépasser 500 caractères'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Fonction utilitaire pour récupérer les erreurs d'un champ spécifique
export function getFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  const error = errors.find(e => e.field === fieldName);
  return error?.message;
}

// Fonction utilitaire pour vérifier si un champ a des erreurs
export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(e => e.field === fieldName);
}