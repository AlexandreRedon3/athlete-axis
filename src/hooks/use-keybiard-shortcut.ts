"use client"

import { useEffect, useState } from 'react';

interface ShortcutAction {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const shortcuts: ShortcutAction[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => setIsCommandPaletteOpen(true),
      description: 'Ouvrir la palette de commandes'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => console.log('Nouveau programme'),
      description: 'Créer un nouveau programme'
    },
    {
      key: 'i',
      ctrlKey: true,
      action: () => console.log('Inviter un client'),
      description: 'Inviter un client'
    },
    {
      key: 's',
      ctrlKey: true,
      shiftKey: true,
      action: () => console.log('Planifier une séance'),
      description: 'Planifier une séance'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.shiftKey === event.shiftKey &&
        !!s.altKey === event.altKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }

      // Fermer la palette avec Escape
      if (event.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  return {
    shortcuts,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen
  };
};