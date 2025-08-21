// src/components/coach/dashboard/ui/command-palette.tsx
"use client"
import { Activity, ArrowRight,Clock, Command, Search, Users } from 'lucide-react';
import React from 'react';
import { useEffect, useRef,useState } from 'react';

import { useTheme } from '../../../../lib/theme-provider';

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const { colors } = useTheme();

  const commands: Command[] = [
    {
      id: 'create-program',
      label: 'Créer un programme',
      description: 'Nouveau programme d\'entraînement personnalisé',
      icon: Activity,
      category: 'Création',
      shortcut: 'Ctrl+N',
      action: () => {
        onClose();
      }
    },
    {
      id: 'invite-client',
      label: 'Inviter un client',
      description: 'Ajouter un nouveau client à votre liste',
      icon: Users,
      category: 'Clients',
      shortcut: 'Ctrl+I',
      action: () => {
        onClose();
      }
    },
    {
      id: 'schedule-session',
      label: 'Planifier une séance',
      description: 'Créer un nouveau rendez-vous avec un client',
      icon: Clock,
      category: 'Planning',
      shortcut: 'Ctrl+Shift+S',
      action: () => {
        onClose();
      }
    },
    // Ajouter d'autres commandes...
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  // Gestion des touches
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            Math.min(prev + 1, filteredCommands.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus sur l'input quand la palette s'ouvre
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Palette */}
      <div className={`
        relative w-full max-w-2xl mx-4
        ${colors.cardBg} rounded-2xl shadow-2xl border ${colors.border}
        animate-in zoom-in-95 slide-in-from-top-2 duration-200
      `}>
        {/* Header avec recherche */}
        <div className="flex items-center p-4 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Rechercher une action ou commande..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              flex-1 bg-transparent outline-none text-sm
              ${colors.text} placeholder:text-muted-foreground
            `}
          />
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 rounded bg-muted">↑</kbd>
            <kbd className="px-2 py-1 rounded bg-muted">↓</kbd>
            <span>pour naviguer</span>
          </div>
        </div>

        {/* Résultats */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedCommands).length === 0 ? (
            <div className="p-8 text-center">
              <Command className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className={`${colors.text} font-medium mb-1`}>
                Aucun résultat trouvé
              </p>
              <p className="text-muted-foreground text-sm">
                Essayez un autre terme de recherche
              </p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category} className="p-2">
                <h3 className={`
                  px-3 py-2 text-xs font-semibold uppercase tracking-wider
                  ${colors.textSecondary}
                `}>
                  {category}
                </h3>
                {categoryCommands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={command.action}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg
                        text-left transition-colors duration-150
                        ${isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/20 border' 
                          : `${colors.hover} border border-transparent`
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg
                          ${isSelected 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          <command.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className={`
                            font-medium text-sm
                            ${isSelected ? 'text-emerald-600' : colors.text}
                          `}>
                            {command.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {command.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {command.shortcut && (
                          <kbd className="px-2 py-1 rounded bg-muted text-xs">
                            {command.shortcut}
                          </kbd>
                        )}
                        <ArrowRight className={`
                          h-4 w-4 transition-transform
                          ${isSelected ? 'text-emerald-600 translate-x-1' : 'text-muted-foreground'}
                        `} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`
          flex items-center justify-between p-3 text-xs
          border-t border-border/50 bg-muted/20
          ${colors.textSecondary}
        `}>
          <div className="flex items-center space-x-4">
            <span>↑↓ naviguer</span>
            <span>↵ sélectionner</span>
            <span>esc fermer</span>
          </div>
          <div className="flex items-center space-x-1">
            <Command className="h-3 w-3" />
            <span>Palette de commandes</span>
          </div>
        </div>
      </div>
    </div>
  );
};