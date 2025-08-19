import { NextRequest, NextResponse } from 'next/server';

// Bibliothèque d'exercices statique (à remplacer par une vraie table BDD plus tard)
const EXERCISE_LIBRARY = [
  { id: '1', name: 'Développé couché', category: 'Poitrine', primaryMuscles: ['Pectoraux'], secondaryMuscles: ['Triceps', 'Deltoïdes'], equipment: 'Barre', instructions: 'Allongez-vous sur le banc, saisissez la barre...', difficulty: 'Intermédiaire' },
  { id: '2', name: 'Squat', category: 'Jambes', primaryMuscles: ['Quadriceps'], secondaryMuscles: ['Fessiers', 'Ischios', 'Mollets'], equipment: 'Barre', instructions: 'Placez la barre sur vos épaules...', difficulty: 'Intermédiaire' },
  { id: '3', name: 'Tractions', category: 'Dos', primaryMuscles: ['Grand dorsal'], secondaryMuscles: ['Biceps', 'Rhomboïdes'], equipment: 'Barre de traction', instructions: 'Suspendez-vous à la barre...', difficulty: 'Avancé' },
  { id: '4', name: 'Pompes', category: 'Poitrine', primaryMuscles: ['Pectoraux'], secondaryMuscles: ['Triceps', 'Core'], equipment: 'Poids du corps', instructions: 'Position de planche, descendez en contrôlant...', difficulty: 'Débutant' },
  { id: '5', name: 'Développé militaire', category: 'Épaules', primaryMuscles: ['Deltoïdes'], secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barre', instructions: 'Debout, barre à hauteur des épaules...', difficulty: 'Intermédiaire' },
  { id: '6', name: 'Soulevé de terre', category: 'Dos', primaryMuscles: ['Érecteur du rachis'], secondaryMuscles: ['Fessiers', 'Ischios', 'Trapèzes'], equipment: 'Barre', instructions: 'Debout face à la barre, pieds écartés...', difficulty: 'Avancé' },
  { id: '7', name: 'Dips', category: 'Triceps', primaryMuscles: ['Triceps'], secondaryMuscles: ['Pectoraux', 'Deltoïdes'], equipment: 'Barres parallèles', instructions: 'Suspendez-vous aux barres...', difficulty: 'Intermédiaire' },
  { id: '8', name: 'Curl biceps', category: 'Bras', primaryMuscles: ['Biceps'], secondaryMuscles: ['Avant-bras'], equipment: 'Haltères', instructions: 'Debout, haltères dans chaque main...', difficulty: 'Débutant' },
  { id: '9', name: 'Planche', category: 'Core', primaryMuscles: ['Abdominaux'], secondaryMuscles: ['Core', 'Épaules'], equipment: 'Poids du corps', instructions: 'Position de pompe, maintenez la position...', difficulty: 'Débutant' },
  { id: '10', name: 'Burpees', category: 'Cardio', primaryMuscles: ['Full body'], secondaryMuscles: ['Cardio-vasculaire'], equipment: 'Poids du corps', instructions: 'Debout, descendez en squat, sautez...', difficulty: 'Intermédiaire' }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let filteredExercises = EXERCISE_LIBRARY;

    // Filtrage par recherche
    if (search) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.name.toLowerCase().includes(search) ||
        ex.category.toLowerCase().includes(search) ||
        ex.primaryMuscles.some(muscle => muscle.toLowerCase().includes(search)) ||
        ex.equipment.toLowerCase().includes(search)
      );
    }

    // Filtrage par catégorie
    if (category) {
      filteredExercises = filteredExercises.filter(ex => ex.category === category);
    }

    // Filtrage par difficulté
    if (difficulty) {
      filteredExercises = filteredExercises.filter(ex => ex.difficulty === difficulty);
    }

    // Récupérer les catégories et difficultés disponibles
    const categories = [...new Set(EXERCISE_LIBRARY.map(ex => ex.category))];
    const difficulties = [...new Set(EXERCISE_LIBRARY.map(ex => ex.difficulty))];

    return NextResponse.json({
      success: true,
      exercises: filteredExercises,
      filters: { categories, difficulties },
      total: filteredExercises.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}