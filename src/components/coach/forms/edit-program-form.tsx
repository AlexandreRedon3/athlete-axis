"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Save, X } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateProgram } from '../../../hooks/use-program-actions';
import { useTheme } from '../../../lib/theme-provider';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';

const editProgramSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  type: z.string().min(1, 'Le type est requis'),
  level: z.string().min(1, 'Le niveau est requis'),
  durationWeeks: z.number().min(1, 'La durée doit être d\'au moins 1 semaine'),
  sessionsPerWeek: z.number().min(1, 'Au moins 1 session par semaine'),
});

type EditProgramForm = z.infer<typeof editProgramSchema>;

interface EditProgramFormProps {
  program: {
    id: string;
    name: string;
    description: string;
    type: string;
    level: string;
    durationWeeks: number;
    sessionsPerWeek: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (program: any) => void;
}

export const EditProgramForm = ({ 
  program, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditProgramFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();
  const { updateProgram, isUpdating } = useUpdateProgram();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<EditProgramForm>({
    resolver: zodResolver(editProgramSchema),
    defaultValues: {
      name: program.name,
      description: program.description,
      type: program.type,
      level: program.level,
      durationWeeks: program.durationWeeks,
      sessionsPerWeek: program.sessionsPerWeek,
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: EditProgramForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await updateProgram({ programId: program.id, programData: data });
      
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <span>Modifier le programme</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du programme *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Programme Débutant - Musculation"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Décrivez votre programme d'entraînement..."
                rows={3}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d'entraînement *</Label>
                <Select 
                  value={watchedValues.type} 
                  onValueChange={(value) => {
                    // Mettre à jour la valeur dans le formulaire
                    const event = { target: { name: 'type', value } };
                    register('type').onChange(event);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Musculation">Musculation</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Fonctionnel">Fonctionnel</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="CrossFit">CrossFit</SelectItem>
                    <SelectItem value="Pilates">Pilates</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="level">Niveau *</Label>
                <Select 
                  value={watchedValues.level} 
                  onValueChange={(value) => {
                    const event = { target: { name: 'level', value } };
                    register('level').onChange(event);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Avancé">Avancé</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationWeeks">Durée (semaines) *</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  min="1"
                  max="52"
                  {...register('durationWeeks', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.durationWeeks && (
                  <p className="text-red-500 text-sm mt-1">{errors.durationWeeks.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sessionsPerWeek">Sessions par semaine *</Label>
                <Input
                  id="sessionsPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  {...register('sessionsPerWeek', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.sessionsPerWeek && (
                  <p className="text-red-500 text-sm mt-1">{errors.sessionsPerWeek.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Aperçu du programme */}
          <div className={`${colors.cardBg} rounded-lg p-4 ${colors.border} border`}>
            <h4 className={`font-semibold ${colors.text} mb-3`}>Aperçu du programme</h4>
            <div className="space-y-2">
              <div>
                <span className={`font-medium ${colors.text}`}>Nom :</span>
                <span className={`ml-2 ${colors.textSecondary}`}>{watchedValues.name || 'Non défini'}</span>
              </div>
              <div>
                <span className={`font-medium ${colors.text}`}>Type :</span>
                <span className={`ml-2 ${colors.textSecondary}`}>{watchedValues.type || 'Non défini'}</span>
              </div>
              <div>
                <span className={`font-medium ${colors.text}`}>Niveau :</span>
                <span className={`ml-2 ${colors.textSecondary}`}>{watchedValues.level || 'Non défini'}</span>
              </div>
              <div>
                <span className={`font-medium ${colors.text}`}>Durée :</span>
                <span className={`ml-2 ${colors.textSecondary}`}>
                  {watchedValues.durationWeeks || 0} semaines, {watchedValues.sessionsPerWeek || 0} sessions/semaine
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
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
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 