"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Activity, 
  CheckCircle,
  Clock, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  Users
} from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRefreshData } from '../../../lib/refresh-store';
import { useTheme } from '../../../lib/theme-provider';
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
  onProgramCreated?: () => void;
}

export const CreateProgramForm = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onProgramCreated 
}: CreateProgramFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();
  const { refreshPrograms } = useRefreshData();

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
      durationWeeks: 4,
      sessionsPerWeek: 3,
      imageUrl: ''
    }
  });

  const watchedValues = watch();

  console.log(isSubmitting);

  // Images par défaut selon le type
  const defaultImages = {
    'Cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'Hypertrophie': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    'Force': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    'Endurance': 'https://images.unsplash.com/photo-1544737151407-9d0f8b4a3d2c?w=400&h=300&fit=crop',
    'Mixte': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'
  };

  const programTypes = [
    { value: 'Cardio', label: 'Cardio', icon: '❤️', description: 'Amélioration cardiovasculaire' },
    { value: 'Hypertrophie', label: 'Body Building', icon: '💪', description: 'Prise de masse musculaire' },
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
      // Utiliser image par défaut si pas d'URL
      const imageUrl = data.imageUrl || defaultImages[data.type as keyof typeof defaultImages];

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      
      // Déclencher le rafraîchissement automatique
      refreshPrograms();
      onProgramCreated?.();
      
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span>Créer un programme</span>
          </DialogTitle>
          <DialogDescription>
                Configurez votre nouveau programme d'entraînement
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom et Description */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du programme *</Label>
              <Input
                {...register('name')}
                placeholder="Ex: Programme Force 4 semaines"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                {...register('description')}
                rows={3}
                placeholder="Décrivez les objectifs et le contenu de votre programme..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Type de programme */}
          <div>
            <Label>Type de programme *</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {programTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.type === type.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : `${colors.border} ${colors.hover}`
                    }
                  `}
                >
                  <input
                    {...register('type')}
                    type="radio"
                    value={type.value}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{type.icon}</div>
                    <div>
                      <div className={`font-medium text-sm ${colors.text}`}>{type.label}</div>
                      <p className={`text-xs ${colors.textSecondary}`}>{type.description}</p>
                    </div>
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
            <Label>Niveau requis *</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {levels.map((level) => (
                <label
                  key={level.value}
                  className={`
                    flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.level === level.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : `${colors.border} ${colors.hover}`
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
                    <div className={`font-medium text-xs ${colors.text}`}>{level.label}</div>
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
              <Label htmlFor="durationWeeks">Durée (semaines) *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('durationWeeks', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="52"
                  className="pl-10"
                />
              </div>
              {errors.durationWeeks && (
                <p className="text-red-500 text-sm mt-1">{errors.durationWeeks.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sessionsPerWeek">Séances par semaine *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('sessionsPerWeek', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="7"
                  className="pl-10"
                />
              </div>
              {errors.sessionsPerWeek && (
                <p className="text-red-500 text-sm mt-1">{errors.sessionsPerWeek.message}</p>
              )}
            </div>
          </div>

          {/* Image URL (optionnel) */}
          <div>
            <Label htmlFor="imageUrl">Image du programme (optionnel)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                {...register('imageUrl')}
                type="url"
                placeholder="https://example.com/image.jpg (optionnel)"
                className="pl-10"
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">
              Une image par défaut sera utilisée si aucune URL n'est fournie
            </p>
          </div>
          {/* Aperçu du programme */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Aperçu du programme</h3>
            
            {/* Card d'aperçu */}
            <div className={`${colors.cardBg} ${colors.border} rounded-xl p-4 shadow-sm border`}>
              {/* Image d'aperçu */}
              <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                <img
                  src={watchedValues.imageUrl || defaultImages[watchedValues.type as keyof typeof defaultImages]}
                  alt="Aperçu du programme"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultImages['Mixte'];
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    watchedValues.level === 'Débutant' ? 'bg-green-100 text-green-700' :
                    watchedValues.level === 'Intermédiaire' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {watchedValues.level}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-3">
                <div>
                  <h4 className={`font-bold text-lg ${colors.text}`}>
                    {watchedValues.name || 'Nom du programme'}
                  </h4>
                  <p className={`text-sm ${colors.textSecondary}`}>{watchedValues.type}</p>
                </div>

                <p className={`text-sm line-clamp-2 ${colors.textSecondary}`}>
                  {watchedValues.description || 'Description du programme...'}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className={`flex items-center ${colors.textSecondary}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    {watchedValues.durationWeeks} sem.
                  </span>
                  <span className={`flex items-center ${colors.textSecondary}`}>
                    <Activity className="w-4 h-4 mr-1" />
                    {watchedValues.sessionsPerWeek}/sem
                  </span>
                  <span className={`flex items-center ${colors.textSecondary}`}>
                    <Users className="w-4 h-4 mr-1" />
                    {(watchedValues.durationWeeks || 0) * (watchedValues.sessionsPerWeek || 0)} séances
                  </span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className={`p-4 rounded-lg ${colors.cardBg} ${colors.border} border`}>
              <h4 className={`font-medium text-sm mb-2 ${colors.text}`}>
                Après création, vous pourrez :
              </h4>
              <ul className={`text-sm space-y-1 ${colors.textSecondary}`}>
                <li>• Ajouter des exercices personnalisés</li>
                <li>• Organiser les séances par semaines</li>
                <li>• Assigner le programme à vos clients</li>
                <li>• Suivre les progrès en temps réel</li>
              </ul>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>Champs obligatoires *</span>
            </div>
            
            <div className="flex items-center space-x-3">
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
                  min-w-[140px]
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
                    Création...
                  </div>
                ) : submitStatus === 'success' ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Créé !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  'Créer le programme'
                )}
              </Button>
            </div>
          </div>
        </form>

        <DialogFooter>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Champs obligatoires *</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};