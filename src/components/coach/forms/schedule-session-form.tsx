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
  X,
  CalendarDays
} from 'lucide-react';
import { useTheme } from '../../../lib/theme-provider';
import { createPortal } from 'react-dom';

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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
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
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className={`${colors.text} text-xl font-bold`}>
                Planifier une séance
              </h2>
              <p className={`${colors.textSecondary} text-sm`}>
                Créez un nouveau rendez-vous avec un client
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
          {/* Client et Titre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Client *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...register('clientId')}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-colors
                  `}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.clientId && (
                <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Titre de la séance *
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="Ex: Séance de musculation"
                className={`
                  w-full px-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  transition-colors
                `}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Date *
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('date')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-colors
                  `}
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Heure *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...register('time')}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-colors
                  `}
                >
                  <option value="">Sélectionner</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Durée (minutes) *
              </label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="15"
                max="180"
                step="15"
                className={`
                  w-full px-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  transition-colors
                `}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Type de séance */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-3`}>
              Type de séance *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sessionTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedValues.type === type.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
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

          {/* Lieu */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Lieu (optionnel)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('location')}
                type="text"
                placeholder="Adresse ou nom du lieu"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  transition-colors
                `}
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Notes (optionnel)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Objectifs, exercices prévus, matériel nécessaire..."
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  transition-colors resize-none
                `}
              />
            </div>
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Résumé de la séance */}
          {(watchedValues.date && watchedValues.time && watchedValues.clientId) && (
            <div className={`p-4 rounded-lg border-2 border-dashed border-purple-200 bg-purple-50 dark:bg-purple-900/20`}>
              <h4 className={`font-medium text-sm ${colors.text} mb-2`}>
                Résumé de la séance
              </h4>
              <div className={`text-sm ${colors.textSecondary} space-y-1`}>
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>La séance sera ajoutée à votre calendrier</span>
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
                    : 'bg-purple-500 hover:bg-purple-600'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Planification...
                  </div>
                ) : submitStatus === 'success' ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Planifié !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  'Planifier la séance'
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