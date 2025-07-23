// src/components/coach/forms/create-program-form.tsx
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Activity, 
  Clock, 
  Users, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import { useTheme } from '../../../lib/theme-provider';
import { createPortal } from 'react-dom';

const createProgramSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Maximum 100 caractères"),
  description: z.string().min(10, "Minimum 10 caractères").max(500, "Maximum 500 caractères"),
  type: z.enum(["Cardio", "Hypertrophie", "Force", "Endurance", "Mixte"], {
    required_error: "Veuillez sélectionner un type"
  }),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"], {
    required_error: "Veuillez sélectionner un niveau"
  }),
  durationWeeks: z.number().min(1, "Minimum 1 semaine").max(52, "Maximum 52 semaines"),
  sessionsPerWeek: z.number().min(1, "Minimum 1 séance").max(7, "Maximum 7 séances"),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal(""))
});

type CreateProgramForm = z.infer<typeof createProgramSchema>;

interface CreateProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (program: any) => void;
}

export const CreateProgramForm = ({ isOpen, onClose, onSuccess }: CreateProgramFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateProgramForm>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'Mixte',
      level: 'Débutant',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      imageUrl: ''
    }
  });

  const watchedValues = watch();

  const programTypes = [
    { value: 'Cardio', label: 'Cardio', icon: '❤️', description: 'Amélioration cardiovasculaire' },
    { value: 'Hypertrophie', label: 'Hypertrophie', icon: '💪', description: 'Prise de masse musculaire' },
    { value: 'Force', label: 'Force', icon: '🏋️', description: 'Développement de la force' },
    { value: 'Endurance', label: 'Endurance', icon: '🏃', description: 'Endurance musculaire' },
    { value: 'Mixte', label: 'Mixte', icon: '⚡', description: 'Combinaison équilibrée' }
  ];

  const levels = [
    { value: 'Débutant', label: 'Débutant', color: 'bg-green-500', description: '0-6 mois d\'expérience' },
    { value: 'Intermédiaire', label: 'Intermédiaire', color: 'bg-blue-500', description: '6 mois - 2 ans' },
    { value: 'Avancé', label: 'Avancé', color: 'bg-purple-500', description: '2+ ans d\'expérience' }
  ];

  const onSubmit = async (data: CreateProgramForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl: data.imageUrl || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      
      // Fermer après un délai pour montrer le succès
      setTimeout(() => {
        reset();
        onClose();
        onSuccess?.(result.program);
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay avec blur plus prononcé */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />
      {/* Modal centrée */}
      <div className={`
        relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
        ${colors.cardBg} rounded-2xl shadow-2xl border ${colors.border}
        animate-in zoom-in-95 fade-in duration-300
        mx-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className={`${colors.text} text-xl font-bold`}>
                Créer un programme
              </h2>
              <p className={`${colors.textSecondary} text-sm`}>
                Configurez votre nouveau programme d'entraînement
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`p-2 ${colors.hover} rounded-lg transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Nom et Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Nom du programme *
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Ex: Programme perte de poids débutant"
                className={`
                  w-full px-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors
                `}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Décrivez les objectifs et le contenu de votre programme..."
                className={`
                  w-full px-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors resize-none
                `}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Type de programme */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-3`}>
              Type de programme *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {programTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.type === type.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : `border-gray-200 ${colors.hover}`
                    }
                  `}
                >
                  <input
                    {...register('type')}
                    type="radio"
                    value={type.value}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className={`font-medium text-sm ${colors.text}`}>
                      {type.label}
                    </div>
                    <p className={`text-xs ${colors.textSecondary} mt-1`}>
                      {type.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>
            )}
          </div>

          {/* Niveau */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-3`}>
              Niveau requis *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((level) => (
                <label
                  key={level.value}
                  className={`
                    flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.level === level.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : `border-gray-200 ${colors.hover}`
                    }
                  `}
                >
                  <input
                    {...register('level')}
                    type="radio"
                    value={level.value}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`w-3 h-3 ${level.color} rounded-full mx-auto mb-2`} />
                    <div className={`font-medium text-sm ${colors.text}`}>
                      {level.label}
                    </div>
                    <p className={`text-xs ${colors.textSecondary} mt-1`}>
                      {level.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.level && (
              <p className="text-red-500 text-sm mt-2">{errors.level.message}</p>
            )}
          </div>

          {/* Durée et Fréquence */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Durée (semaines) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('durationWeeks', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="52"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-colors
                  `}
                />
              </div>
              {errors.durationWeeks && (
                <p className="text-red-500 text-sm mt-1">{errors.durationWeeks.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Séances par semaine *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('sessionsPerWeek', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="7"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-colors
                  `}
                />
              </div>
              {errors.sessionsPerWeek && (
                <p className="text-red-500 text-sm mt-1">{errors.sessionsPerWeek.message}</p>
              )}
            </div>
          </div>

          {/* Image URL (optionnel) */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Image du programme (optionnel)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('imageUrl')}
                type="url"
                placeholder="https://example.com/image.jpg"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors
                `}
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>Les champs avec * sont obligatoires</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${colors.textSecondary} ${colors.hover}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-2 rounded-lg font-medium text-sm text-white
                  transition-all duration-200 min-w-[120px]
                  disabled:cursor-not-allowed
                  ${submitStatus === 'success' 
                    ? 'bg-green-500' 
                    : submitStatus === 'error'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Création...
                  </div>
                ) : submitStatus === 'success' ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Créé !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  'Créer le programme'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};