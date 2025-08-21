// src/components/coach/forms/invite-client-form.tsx
"use client"

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  CheckCircle,
  Loader2,
  Mail, 
  MessageCircle,
  Send,
  User, 
  UserPlus} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTheme } from '../../../lib/theme-provider';
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>Inviter un client</span>
              <DialogDescription className="mt-1">
                Ajoutez un nouveau client à votre liste
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email">Adresse email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder="client@example.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register('firstName')}
                  type="text"
                  placeholder="Jean"
                  className="pl-10"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                {...register('lastName')}
                type="text"
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Message personnalisé */}
          <div>
            <Label htmlFor="message">Message personnalisé (optionnel)</Label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                {...register('message')}
                rows={4}
                placeholder="Ajoutez un message personnel pour votre invitation..."
                className="pl-10"
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">
              {watchedValues.message?.length || 0}/500 caractères
            </p>
          </div>

          {/* Options */}
          <div className={`p-4 rounded-lg ${colors.cardBg} ${colors.border} border`}>
            <div className="flex items-start space-x-3">
              <Checkbox
                {...register('sendWelcomeEmail')}
                id="sendWelcomeEmail"
                className="mt-1"
              />
              <div>
                <Label htmlFor="sendWelcomeEmail" className="text-sm font-medium">
                  Envoyer un email de bienvenue
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Le client recevra un email avec les instructions pour se connecter
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu de l'invitation */}
          {(watchedValues.firstName || watchedValues.lastName) && (
            <div className={`p-4 rounded-lg border-2 border-dashed border-emerald-200 ${colors.cardBg}`}>
              <h4 className="font-medium text-sm mb-2">
                Aperçu de l'invitation
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>Bonjour {watchedValues.firstName} {watchedValues.lastName},</p>
                <p className="mt-2">
                  Vous avez été invité(e) à rejoindre AthleteAxis en tant que client.
                </p>
                {watchedValues.message && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded italic">
                    "{watchedValues.message}"
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        <DialogFooter className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-600">
              Une invitation sera envoyée à {watchedValues.email || 'l\'adresse email'}
            </p>
            
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
              onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !watchedValues.email}
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
                    Envoi...
                  </div>
                ) : submitStatus === 'success' ? (
                <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Envoyé !
                  </div>
                ) : submitStatus === 'error' ? (
                  'Réessayer'
                ) : (
                <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </div>
                )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};