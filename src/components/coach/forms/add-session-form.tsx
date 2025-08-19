// src/components/coach/forms/add-session-form.tsx
"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Calendar, 
  CheckCircle,
  Clock, 
  Loader2, 
  Target,
  TrendingUp} from 'lucide-react';
import { useState } from 'react';
import {useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTheme } from '../../../lib/theme-provider';
import { Badge } from '../../ui/badge';
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
import { Textarea } from "../../ui/textarea";

const addSessionSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Maximum 100 caractères"),
  weekNumber: z.number().min(1, "Semaine 1 minimum").max(52, "Maximum 52 semaines"),
  dayNumber: z.number().min(1, "Jour 1 minimum").max(7, "Maximum 7 jours"),
  type: z.enum(["Push", "Pull", "Legs", "Full Body", "Upper", "Lower", "Cardio", "Recovery"], {
    required_error: "Veuillez sélectionner un type"
  }),
  targetRPE: z.number().min(1, "RPE minimum 1").max(10, "RPE maximum 10"),
  duration: z.number().min(15, "Durée minimum 15 minutes").max(180, "Durée maximum 180 minutes"),
  notes: z.string().max(500, "Maximum 500 caractères").optional()
});

type AddSessionForm = z.infer<typeof addSessionSchema>;

interface Program {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  status: 'published' | 'draft';
}

interface AddSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
  onSuccess?: (session: any) => void;
}

const sessionTypes = [
  { value: "Push", label: "Push", description: "Poitrine, épaules, triceps" },
  { value: "Pull", label: "Pull", description: "Dos, biceps, arrière-épaules" },
  { value: "Legs", label: "Legs", description: "Jambes complètes" },
  { value: "Full Body", label: "Full Body", description: "Tout le corps" },
  { value: "Upper", label: "Upper", description: "Haut du corps" },
  { value: "Lower", label: "Lower", description: "Bas du corps" },
  { value: "Cardio", label: "Cardio", description: "Cardio-vasculaire" },
  { value: "Recovery", label: "Recovery", description: "Récupération active" }
];

export const AddSessionForm = ({ 
  isOpen, 
  onClose, 
  program,
  onSuccess 
}: AddSessionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<AddSessionForm>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      name: '',
      weekNumber: 1,
      dayNumber: 1,
      type: 'Push',
      targetRPE: 7,
      duration: 60,
      notes: ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: AddSessionForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Appel API pour créer la session
      const response = await fetch(`/api/programs/${program.id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          weekNumber: data.weekNumber,
          dayNumber: data.dayNumber,
          type: data.type,
          targetRPE: data.targetRPE,
          duration: data.duration,
          notes: data.notes || ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        reset();
        onClose();
        onSuccess?.(result.session);
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
      reset();
      setSubmitStatus('idle');
      onClose();
    }
  };

  const getRPEColor = (rpe: number) => {
    if (rpe <= 6) return 'text-green-600 bg-green-100';
    if (rpe <= 7) return 'text-yellow-600 bg-yellow-100';
    if (rpe <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRPEDescription = (rpe: number) => {
    if (rpe <= 4) return 'Très léger';
    if (rpe <= 6) return 'Léger à modéré';
    if (rpe <= 7) return 'Modéré';
    if (rpe <= 8) return 'Intense';
    if (rpe <= 9) return 'Très intense';
    return 'Maximal';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span>Ajouter une session</span>
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle session pour le programme "{program.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne de gauche - Formulaire */}
            <div className="space-y-4">
              {/* Nom de la session */}
              <div>
                <Label htmlFor="name">Nom de la session *</Label>
                <Input
                  {...register('name')}
                  placeholder="Ex: Séance Push - Semaine 1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Semaine et jour */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weekNumber">Semaine *</Label>
                  <Input
                    {...register('weekNumber', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max={program.durationWeeks}
                  />
                  {errors.weekNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.weekNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dayNumber">Jour *</Label>
                  <Input
                    {...register('dayNumber', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="7"
                  />
                  {errors.dayNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.dayNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Type de session */}
              <div>
                <Label>Type de session *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sessionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${watchedValues.type === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        {...register('type')}
                        type="radio"
                        value={type.value}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* RPE et durée */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetRPE">RPE cible *</Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      {...register('targetRPE', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      className="pl-10"
                    />
                  </div>
                  {errors.targetRPE && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetRPE.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duration">Durée (minutes) *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      {...register('duration', { valueAsNumber: true })}
                      type="number"
                      min="15"
                      max="180"
                      className="pl-10"
                    />
                  </div>
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Instructions spécifiques, conseils..."
                />
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
              <h3 className={`text-lg font-bold ${colors.text}`}>Aperçu de la session</h3>
              
              <div className={`${colors.cardBg} rounded-xl p-4 space-y-4 border ${colors.border}`}>
                {/* Informations générales */}
                <div>
                  <h4 className={`font-medium mb-2 ${colors.text}`}>Session</h4>
                  <p className={`text-lg font-semibold ${colors.text}`}>
                    {watchedValues.name || 'Nom de la session'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className={`${colors.text}`}>{watchedValues.type}</Badge>
                    <span className={`text-sm ${colors.textSecondary}`}>
                      Semaine {watchedValues.weekNumber}, Jour {watchedValues.dayNumber}
                    </span>
                  </div>
                </div>

                {/* RPE */}
                <div>
                  <h4 className={`font-medium mb-2 ${colors.text}`}>Intensité cible</h4>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRPEColor(watchedValues.targetRPE)}`}>
                    <Target className="h-4 w-4 mr-1" />
                    RPE {watchedValues.targetRPE}/10
                  </div>
                  <p className={`text-sm ${colors.textSecondary} mt-1`}>
                    {getRPEDescription(watchedValues.targetRPE)}
                  </p>
                </div>

                {/* Durée */}
                <div>
                  <h4 className={`font-medium mb-2 ${colors.text}`}>Durée estimée</h4>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className={`font-medium ${colors.text}`}>{watchedValues.duration} minutes</span>
                  </div>
                </div>

                {/* Progression */}
                {watchedValues.weekNumber > 1 && (
                  <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 ${colors.cardBg}`}>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className={`text-sm font-medium text-blue-800 dark:text-blue-200 ${colors.text}`}>
                        Progression de l'intensité
                      </span>
                    </div>
                    <p className={`text-xs text-blue-600 dark:text-blue-300 mt-1 ${colors.textSecondary}`}>
                      Cette session s'inscrit dans la progression du programme
                    </p>
                  </div>
                )}

                {/* Notes */}
                {watchedValues.notes && (
                  <div>
                    <h4 className={`font-medium mb-2 ${colors.text}`}>Notes</h4>
                    <p className={`text-sm ${colors.textSecondary} italic`}>{watchedValues.notes}</p>
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
              className={`
                min-w-[120px]
                ${submitStatus === 'success' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : submitStatus === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Création...
                </div>
              ) : submitStatus === 'success' ? (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Créée !
                </div>
              ) : submitStatus === 'error' ? (
                'Réessayer'
              ) : (
                'Créer la session'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 