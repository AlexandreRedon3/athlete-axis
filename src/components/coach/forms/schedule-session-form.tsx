// src/components/coach/forms/schedule-session-form.tsx
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  FileText,
  Loader2,
  CheckCircle,
  CalendarDays,
  X
} from 'lucide-react';
import { useTheme } from '../../../lib/theme-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const scheduleSessionSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  title: z.string().min(3, "Minimum 3 caractères").max(100, "Maximum 100 caractères"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  duration: z.number().min(15, "Minimum 15 minutes").max(180, "Maximum 3 heures"),
  location: z.string().max(200, "Maximum 200 caractères").optional(),
  type: z.enum(["Présentiel", "En ligne", "Extérieur"], {
    required_error: "Veuillez sélectionner un type"
  }),
  notes: z.string().max(500, "Maximum 500 caractères").optional()
});

type ScheduleSessionForm = z.infer<typeof scheduleSessionSchema>;

interface ScheduleSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (session: any) => void;
}

export const ScheduleSessionForm = ({ isOpen, onClose, onSuccess }: ScheduleSessionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();

  // Clients simulés - en réalité, ils viendraient d'un hook API
  const clients = [
    { id: '1', name: 'Alexandre Dupont', email: 'alex@example.com' },
    { id: '2', name: 'Julie Bernard', email: 'julie@example.com' },
    { id: '3', name: 'Marc Leroy', email: 'marc@example.com' }
  ];

  const sessionTypes = [
    { value: 'Présentiel', label: 'Présentiel', icon: '🏠', description: 'En salle ou à domicile' },
    { value: 'En ligne', label: 'En ligne', icon: '💻', description: 'Visio-conférence' },
    { value: 'Extérieur', label: 'Extérieur', icon: '🌳', description: 'Parc, plage, etc.' }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ScheduleSessionForm>({
    resolver: zodResolver(scheduleSessionSchema),
    defaultValues: {
      clientId: '',
      title: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      type: 'Présentiel',
      notes: ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: ScheduleSessionForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Ici on appellerait l'API pour créer la séance
      const response = await fetch('/api/coach/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la planification');
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

  // Générer les créneaux horaires
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span>Planifier une séance</span>
          </DialogTitle>
          <DialogDescription>
                Créez un nouveau rendez-vous avec un client
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client et Titre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId">Client *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Select
                  value={watchedValues.clientId}
                  onValueChange={(value) => setValue('clientId', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                  {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                      {client.name}
                      </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.clientId && (
                <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Titre de la séance *</Label>
              <Input
                {...register('title')}
                type="text"
                placeholder="Ex: Séance de musculation"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('date')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10"
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time">Heure *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Select
                  value={watchedValues.time}
                  onValueChange={(value) => setValue('time', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                  {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                      {time}
                      </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Durée (minutes) *</Label>
              <Input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="15"
                max="180"
                step="15"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Type de séance */}
          <div>
            <Label>Type de séance *</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {sessionTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.type === type.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
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
                  <div className="text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>
            )}
          </div>

          {/* Lieu */}
          <div>
            <Label htmlFor="location">Lieu (optionnel)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                {...register('location')}
                type="text"
                placeholder="Adresse ou nom du lieu"
                className="pl-10"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                {...register('notes')}
                rows={3}
                placeholder="Objectifs, exercices prévus, matériel nécessaire..."
                className="pl-10"
              />
            </div>
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Résumé de la séance */}
          {(watchedValues.date && watchedValues.time && watchedValues.clientId) && (
            <div className="p-4 rounded-lg border-2 border-dashed border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <h4 className="font-medium text-sm mb-2">
                Résumé de la séance
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Client:</strong> {clients.find(c => c.id === watchedValues.clientId)?.name || 'Non sélectionné'}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(watchedValues.date).toLocaleDateString('fr-FR')} à {watchedValues.time}
                </p>
                <p>
                  <strong>Durée:</strong> {watchedValues.duration} minutes
                </p>
                <p>
                  <strong>Type:</strong> {watchedValues.type}
                </p>
                {watchedValues.location && (
                  <p>
                    <strong>Lieu:</strong> {watchedValues.location}
                  </p>
                )}
              </div>
            </div>
          )}
        </form>
        <DialogFooter>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
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
                    : 'bg-purple-500 hover:bg-purple-600'
                  }
                `}
              >
                {isSubmitting ? (
                <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Planification...
                  </div>
                ) : submitStatus === 'success' ? (
                <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                  Planifiée !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  'Planifier la séance'
                )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};