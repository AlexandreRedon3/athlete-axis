// src/components/coach/forms/add-exercise-to-program-form.tsx
"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Activity, 
  CheckCircle,
  Clock, 
  Dumbbell,
  FileText,
  Hash,
  Loader2,
  Plus, 
  Search
} from 'lucide-react';
import { useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddExercise,useCoachPrograms, useExerciseLibrary } from '../../../hooks/use-exercise-data';
import { useProgramSessions } from '../../../hooks/use-program-sessions';
import { useTheme } from '../../../lib/theme-provider';
import { validateAddExerciseForm } from '../../../lib/validations/exercise-schema';
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";

const addExerciseSchema = z.object({
  programId: z.string().min(1, "Veuillez sélectionner un programme"),
  sessionId: z.string().min(1, "Veuillez sélectionner une session"),
  exerciseType: z.enum(["custom", "library"], {
    required_error: "Veuillez choisir un type d'exercice"
  }),
  name: z.string().min(1, "Le nom est requis pour un exercice personnalisé").max(100, "Maximum 100 caractères").optional(),
  libraryExerciseId: z.string().optional(),
  sets: z.number().min(1, "Minimum 1 série").max(10, "Maximum 10 séries"),
  reps: z.number().min(1, "Minimum 1 répétition").max(100, "Maximum 100 répétitions"),
  rpe: z.number().min(1, "Minimum 1").max(10, "Maximum 10").optional().nullable(),
  restSeconds: z.number().min(0, "Minimum 0 secondes").max(600, "Maximum 600 secondes").optional().nullable(),
  notes: z.string().max(500, "Maximum 500 caractères").optional()
}).refine((data) => {
  if (data.exerciseType === 'custom' && !data.name) {
    return false;
  }
  if (data.exerciseType === 'library' && !data.libraryExerciseId) {
    return false;
  }
  return true;
}, {
  message: "Données manquantes selon le type d'exercice",
  path: ["exerciseType"]
});

type AddExerciseForm = z.infer<typeof addExerciseSchema>;

interface AddExerciseToProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (exercise: any) => void;
  preselectedProgramId?: string;
  preselectedSessionId?: string;
}

export const AddExerciseToProgramForm = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  preselectedProgramId,
  preselectedSessionId
}: AddExerciseToProgramFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const { colors } = useTheme();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger
  } = useForm<AddExerciseForm>({
    resolver: zodResolver(addExerciseSchema),
    defaultValues: {
      programId: preselectedProgramId || '',
      sessionId: preselectedSessionId || '',
      exerciseType: 'custom',
      name: '',
      libraryExerciseId: '',
      sets: 3,
      reps: 12,
      rpe: undefined,
      restSeconds: 90,
      notes: ''
    }
  });

  const watchedValues = watch();

  // Hooks API
  const { programs, isLoading: programsLoading, error: programsError } = useCoachPrograms();
  const { sessions, isLoading: sessionsLoading, error: sessionsError } = useProgramSessions(watchedValues.programId);
  const { exercises: libraryExercises, isLoading: libraryLoading, error: libraryError } = useExerciseLibrary(searchTerm);
  const { addExercise, isSubmitting: isAddingExercise } = useAddExercise();
  

  console.log("sessions", sessions);
  console.log("programId", watchedValues.programId);
  const selectedProgram = programs.find(p => p.id === watchedValues.programId);
  const availableSessions = sessions; // Toutes les sessions du programme sélectionné
  console.log("availableSessions", availableSessions);
  
  // Filtrage des exercices de la bibliothèque
  const filteredLibraryExercises = libraryExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedLibraryExercise = libraryExercises.find(
    ex => ex.id === watchedValues.libraryExerciseId
  );

  const selectedSession = sessions.find(s => s.id === watchedValues.sessionId);

  const onSubmit = async (data: AddExerciseForm) => {
    console.log('onSubmit called with data:', data);
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validation côté client
      const validationData = {
        ...data,
        rpe: data.rpe ?? undefined,
        restSeconds: data.restSeconds ?? undefined
      };
      console.log('validationData:', validationData);
      
      const validationResult = validateAddExerciseForm(validationData);
      if (!validationResult.isValid) {
        console.error('Erreurs de validation:', validationResult.errors);
        setSubmitStatus('error');
        return;
      }

      console.log('Validation passed, calling addExercise...');
      // Appel API pour ajouter l'exercice
      const result = await addExercise(data);
      console.log('addExercise result:', result);
      
      setSubmitStatus('success');
      
      // Fermer après un délai pour montrer le succès
      setTimeout(() => {
        reset();
        onClose();
        onSuccess?.(result.exercise);
        setSubmitStatus('idle');
      }, 1500);

    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset({
        programId: preselectedProgramId || '',
        sessionId: selectedSession?.id || '',
        exerciseType: 'custom',
        name: '',
        libraryExerciseId: '',
        sets: 3,
        reps: 12,
        rpe: undefined,
        restSeconds: 90,
        notes: ''
      });
      setSubmitStatus('idle');
      setSearchTerm('');
      onClose();
    }
  };

  const formatRestTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds === 0 ? `${minutes}min` : `${minutes}min ${remainingSeconds}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span>Ajouter un exercice</span>
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel exercice à votre programme d'entraînement
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne de gauche - Formulaire principal */}
              <div className="space-y-4">
                {/* Sélection du programme et session */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="programId">Programme *</Label>
                    <Controller
                      name="programId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue('sessionId', ''); // Reset session when program changes
                          }}
                          disabled={programsLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={programsLoading ? "Chargement..." : "Sélectionner un programme"} />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.programId && (
                      <p className="text-red-500 text-sm mt-1">{errors.programId.message}</p>
                    )}
                    {programsError && (
                      <p className="text-red-500 text-sm mt-1">Erreur lors du chargement des programmes</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sessionId">Session *</Label>
                    <Controller
                      name="sessionId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!watchedValues.programId || sessionsLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={sessionsLoading ? "Chargement..." : "Sélectionner une session"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSessions.map((session) => (
                              <SelectItem key={session.id} value={session.id}>
                                {session.name} - {session.weekNumber} - {session.dayNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.sessionId && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessionId.message}</p>
                    )}
                    {sessionsError && (
                      <p className="text-red-500 text-sm mt-1">Erreur lors du chargement des sessions</p>
                    )}
                  </div>
                </div>

                {/* Type d'exercice */}
                <div>
                  <Label>Type d'exercice *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <label className={`
                      flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watchedValues.exerciseType === 'custom'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}>
                      <input
                        {...register('exerciseType')}
                        type="radio"
                        value="custom"
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-medium text-sm">Personnalisé</div>
                          <p className="text-xs text-gray-600">Créer un nouvel exercice</p>
                        </div>
                      </div>
                    </label>

                    <label className={`
                      flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watchedValues.exerciseType === 'library'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}>
                      <input
                        {...register('exerciseType')}
                        type="radio"
                        value="library"
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-2">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">Bibliothèque</div>
                          <p className="text-xs text-gray-600">Depuis la bibliothèque</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  {errors.exerciseType && (
                    <p className="text-red-500 text-sm mt-1">{errors.exerciseType.message}</p>
                  )}
                </div>

                {/* Nom de l'exercice (si personnalisé) */}
                {watchedValues.exerciseType === 'custom' && (
                  <div>
                    <Label htmlFor="name">Nom de l'exercice *</Label>
                    <Input
                      {...register('name')}
                      placeholder="Ex: Développé couché haltères"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                )}

                {/* Bibliothèque d'exercices */}
                {watchedValues.exerciseType === 'library' && (
                  <div className="space-y-3">
                    <Label>Exercice de la bibliothèque *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un exercice..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto border rounded-lg">
                      {libraryLoading ? (
                        <div className="p-4 text-center text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Chargement...
                        </div>
                      ) : libraryError ? (
                        <div className="p-4 text-center text-red-500">
                          Erreur lors du chargement
                        </div>
                      ) : filteredLibraryExercises.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Aucun exercice trouvé
                        </div>
                      ) : (
                        filteredLibraryExercises.map((exercise) => (
                          <label
                            key={exercise.id}
                            className={`
                              flex items-center p-3 cursor-pointer border-b last:border-b-0 transition-colors
                              ${watchedValues.libraryExerciseId === exercise.id ? 'bg-emerald-50' : ''}
                            `}
                            style={{
                              backgroundColor: watchedValues.libraryExerciseId === exercise.id 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (watchedValues.libraryExerciseId !== exercise.id) {
                                e.currentTarget.style.backgroundColor = colors.hover;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (watchedValues.libraryExerciseId !== exercise.id) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <input
                              {...register('libraryExerciseId')}
                              type="radio"
                              value={exercise.id}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{exercise.name}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className={`${colors.textSecondary} text-xs`}>
                                  {exercise.category}
                                </Badge>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>
                                  {exercise.primaryMuscles.join(', ')}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {errors.libraryExerciseId && (
                      <p className="text-red-500 text-sm mt-1">{errors.libraryExerciseId.message}</p>
                    )}
                  </div>
                )}

                {/* Paramètres d'entraînement */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sets">Séries *</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...register('sets', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="10"
                        className="pl-10"
                      />
                    </div>
                    {errors.sets && (
                      <p className="text-red-500 text-sm mt-1">{errors.sets.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reps">Répétitions *</Label>
                    <Input
                      {...register('reps', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="100"
                    />
                    {errors.reps && (
                      <p className="text-red-500 text-sm mt-1">{errors.reps.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rpe">RPE (1-10)</Label>
                    <Input
                      {...register('rpe', { 
                        valueAsNumber: true,
                        setValueAs: (value) => value === '' ? undefined : Number(value)
                      })}
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Optionnel"
                    />
                    {errors.rpe && (
                      <p className="text-red-500 text-sm mt-1">{errors.rpe.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="restSeconds">Repos (secondes)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...register('restSeconds', { 
                          valueAsNumber: true,
                          setValueAs: (value) => value === '' ? undefined : Number(value)
                        })}
                        type="number"
                        min="0"
                        max="600"
                        placeholder="90"
                        className="pl-10"
                      />
                    </div>
                    {errors.restSeconds && (
                      <p className="text-red-500 text-sm mt-1">{errors.restSeconds.message}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Instructions spécifiques, conseils techniques..."
                      className="pl-10"
                    />
                  </div>
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    {watchedValues.notes?.length || 0}/500 caractères
                  </p>
                </div>
              </div>

              {/* Colonne de droite - Aperçu */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>Aperçu de l'exercice</h3>
                
                <div 
                  className="rounded-xl p-4 space-y-4"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {/* Informations générales */}
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: colors.text }}>Exercice</h4>
                    <p className="text-lg font-semibold" style={{ color: colors.text }}>
                      {watchedValues.exerciseType === 'custom' 
                        ? watchedValues.name || 'Nom de l\'exercice' 
                        : selectedLibraryExercise?.name || 'Sélectionner un exercice'
                      }
                    </p>
                    {selectedLibraryExercise && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className={`${colors.textSecondary}`}>{selectedLibraryExercise.category}</Badge>
                        {selectedLibraryExercise.equipment && (
                          <Badge variant="secondary" className={`${colors.textSecondary}`}>{selectedLibraryExercise.equipment}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Paramètres */}
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: colors.text }}>Paramètres</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Séries:</span>
                        <span className="font-medium" style={{ color: colors.text }}>{watchedValues.sets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Répétitions:</span>
                        <span className="font-medium" style={{ color: colors.text }}>{watchedValues.reps}</span>
                      </div>
                      {watchedValues.rpe && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.textSecondary }}>RPE:</span>
                          <span className="font-medium" style={{ color: colors.text }}>{watchedValues.rpe}/10</span>
                        </div>
                      )}
                      {watchedValues.restSeconds && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.textSecondary }}>Repos:</span>
                          <span className="font-medium" style={{ color: colors.text }}>{formatRestTime(watchedValues.restSeconds)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Programme et session */}
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: colors.text }}>Emplacement</h4>
                    <p className="text-sm">
                      <span className="font-medium" style={{ color: colors.text }}>Programme:</span> 
                      <span style={{ color: colors.textSecondary }}> {selectedProgram?.name || 'Non sélectionné'}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium" style={{ color: colors.text }}>Session:</span> 
                      <span style={{ color: colors.textSecondary }}> {
                        availableSessions.find(s => s.id === watchedValues.sessionId)?.name || 'Non sélectionnée'
                      }</span>
                    </p>
                  </div>

                  {/* Notes */}
                  {watchedValues.notes && (
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: colors.text }}>Notes</h4>
                      <p className="text-sm italic" style={{ color: colors.textSecondary }}>{watchedValues.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  onSubmit(watchedValues);
                }}
                className={`
                  min-w-[120px]
                  ${submitStatus === 'success' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : submitStatus === 'error'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Ajout...
                  </div>
                ) : submitStatus === 'success' ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ajouté !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  'Ajouter l\'exercice'
                )}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};