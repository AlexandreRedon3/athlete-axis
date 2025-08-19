// src/components/coach/dashboard/ui/quick-actions-menu-with-forms.tsx
"use client"

import { 
  Activity, 
  BookOpen,
  Calendar, 
  ChevronDown,
  Dumbbell,
  Mail,
  Plus, 
  UserPlus} from 'lucide-react';
import { useEffect,useRef, useState } from 'react';

import { useTheme } from '../../../../lib/theme-provider';
import { CreateProgramForm } from '../../forms/create-program-form';
import { InviteClientForm } from '../../forms/invite-client-form';
import { ScheduleSessionForm } from '../../forms/schedule-session-form';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  onClick: () => void;
}

export const QuickActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { colors } = useTheme();

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSuccess = (data: any) => {
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create-program',
      label: 'Créer un programme',
      icon: Activity,
      description: 'Nouveau programme d\'entraînement',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        setActiveForm('create-program');
        setIsOpen(false);
      }
    },
    {
      id: 'invite-client',
      label: 'Inviter un client',
      icon: UserPlus,
      description: 'Ajouter un nouveau client',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: () => {
        setActiveForm('invite-client');
        setIsOpen(false);
      }
    },
    {
      id: 'schedule-session',
      label: 'Planifier une séance',
      icon: Calendar,
      description: 'Créer un nouveau rendez-vous',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        setActiveForm('schedule-session');
        setIsOpen(false);
      }
    },
    {
      id: 'create-workout',
      label: 'Créer un entraînement',
      icon: Dumbbell,
      description: 'Séance d\'entraînement personnalisée',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {
        setIsOpen(false);
      }
    },
    {
      id: 'nutrition-plan',
      label: 'Plan nutritionnel',
      icon: BookOpen,
      description: 'Créer un plan alimentaire',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        setIsOpen(false);
      }
    },
    {
      id: 'send-message',
      label: 'Envoyer un message',
      icon: Mail,
      description: 'Communiquer avec vos clients',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => {
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Bouton principal */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
            bg-emerald-600 hover:bg-emerald-700 text-white
            transition-all duration-200 shadow-sm hover:shadow-md
            ${isOpen ? 'bg-emerald-700' : ''}
          `}
        >
          <Plus className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
          <span className="hidden sm:inline">Actions rapides</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div className={`
            absolute top-full right-0 mt-2 w-80 
            ${colors.cardBg} rounded-xl shadow-xl border ${colors.border}
            z-50 overflow-hidden
            animate-in slide-in-from-top-2 duration-200
          `}>
            <div className="p-3">
              <h3 className={`${colors.text} font-semibold text-sm mb-3`}>
                Actions rapides
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className={`
                      p-3 rounded-lg text-left transition-all duration-200
                      ${colors.hover} hover:scale-[1.02] active:scale-[0.98]
                      group border ${colors.border}
                    `}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h4 className={`${colors.text} font-medium text-sm mb-1 group-hover:text-emerald-600 transition-colors`}>
                      {action.label}
                    </h4>
                    <p className={`${colors.textSecondary} text-xs`}>
                      {action.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Séparateur et actions secondaires */}
            <div className={`border-t ${colors.border} p-3 bg-muted/20`}>
              <div className="flex items-center justify-between">
                <p className={`${colors.textSecondary} text-xs`}>
                  Raccourcis clavier disponibles
                </p>
                <kbd className={`
                  px-2 py-1 rounded text-xs font-mono
                  ${colors.textSecondary} bg-muted border ${colors.border}
                `}>
                  Ctrl + K
                </kbd>
              </div>
            </div>
          </div>
        )}

        {/* Overlay pour fermer le menu */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Formulaires */}
      <CreateProgramForm
        isOpen={activeForm === 'create-program'}
        onClose={() => setActiveForm(null)}
        onSuccess={handleFormSuccess}
      />

      <InviteClientForm
        isOpen={activeForm === 'invite-client'}
        onClose={() => setActiveForm(null)}
        onSuccess={handleFormSuccess}
      />
      <ScheduleSessionForm
        isOpen={activeForm === 'schedule-session'}
        onClose={() => setActiveForm(null)}
        onSuccess={handleFormSuccess}
      />
    </>
  );
};