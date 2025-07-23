// src/components/coach/forms/invite-client-form.tsx
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  UserPlus, 
  Mail, 
  User, 
  MessageCircle,
  Loader2,
  CheckCircle,
  X,
  Send
} from 'lucide-react';
import { useTheme } from '../../../lib/theme-provider';
import { createPortal } from 'react-dom';

const inviteClientSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  firstName: z.string().min(2, "Minimum 2 caractères").max(50, "Maximum 50 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères").max(50, "Maximum 50 caractères"),
  message: z.string().max(500, "Maximum 500 caractères").optional(),
  sendWelcomeEmail: z.boolean().default(true).optional()
});

type InviteClientForm = z.infer<typeof inviteClientSchema>;

interface InviteClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (client: any) => void;
}

export const InviteClientForm = ({ isOpen, onClose, onSuccess }: InviteClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { colors } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<InviteClientForm>({
    resolver: zodResolver(inviteClientSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      message: '',
      sendWelcomeEmail: true
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: InviteClientForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Ici on appellerait l'API pour inviter le client
      // Pour l'instant, on simule l'appel
      const response = await fetch('/api/coach/invite-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'invitation');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      
      // Fermer après un délai pour montrer le succès
      setTimeout(() => {
        reset();
        onClose();
        onSuccess?.(result.client);
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
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className={`
        relative w-full max-w-lg max-h-[90vh] overflow-y-auto
        ${colors.cardBg} rounded-2xl shadow-2xl border ${colors.border}
        animate-in zoom-in-95 slide-in-from-bottom-2 duration-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className={`${colors.text} text-xl font-bold`}>
                Inviter un client
              </h2>
              <p className={`${colors.textSecondary} text-sm`}>
                Ajoutez un nouveau client à votre liste
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
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Adresse email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="client@example.com"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors
                `}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Prénom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('firstName')}
                  type="text"
                  placeholder="Jean"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                    ${colors.cardBg} ${colors.text}
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    transition-colors
                  `}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Nom *
              </label>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Dupont"
                className={`
                  w-full px-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors
                `}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Message personnalisé */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Message personnalisé (optionnel)
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Ajoutez un message personnel pour votre invitation..."
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border}
                  ${colors.cardBg} ${colors.text}
                  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-colors resize-none
                `}
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
            <p className={`text-xs ${colors.textSecondary} mt-1`}>
              {watchedValues.message?.length || 0}/500 caractères
            </p>
          </div>

          {/* Options */}
          <div className={`p-4 rounded-lg ${colors.cardBg} border ${colors.border}`}>
            <div className="flex items-start space-x-3">
              <input
                {...register('sendWelcomeEmail')}
                type="checkbox"
                id="sendWelcomeEmail"
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <div>
                <label htmlFor="sendWelcomeEmail" className={`text-sm font-medium ${colors.text}`}>
                  Envoyer un email de bienvenue
                </label>
                <p className={`text-xs ${colors.textSecondary} mt-1`}>
                  Le client recevra un email avec les instructions pour se connecter
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu de l'invitation */}
          {(watchedValues.firstName || watchedValues.lastName) && (
            <div className={`p-4 rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20`}>
              <h4 className={`font-medium text-sm ${colors.text} mb-2`}>
                Aperçu de l'invitation
              </h4>
              <div className={`text-sm ${colors.textSecondary}`}>
                <p>Bonjour {watchedValues.firstName} {watchedValues.lastName},</p>
                <p className="mt-2">
                  Vous avez été invité(e) à rejoindre AthleteAxis en tant que client.
                </p>
                {watchedValues.message && (
                  <div className="mt-2 p-2 bg-white/50 rounded italic">
                    "{watchedValues.message}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <p className={`text-sm ${colors.textSecondary}`}>
              Une invitation sera envoyée à {watchedValues.email || 'l\'adresse email'}
            </p>
            
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
                disabled={isSubmitting || !watchedValues.email}
                className={`
                  px-6 py-2 rounded-lg font-medium text-sm text-white
                  transition-all duration-200 min-w-[120px]
                  disabled:cursor-not-allowed disabled:opacity-50
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
                    Envoi...
                  </div>
                ) : submitStatus === 'success' ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Envoyé !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </div>
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