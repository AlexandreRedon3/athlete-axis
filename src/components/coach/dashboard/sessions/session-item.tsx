// src/components/coach/dashboard/sessions/session-item.tsx
"use client"
import React from 'react';

import { useTheme } from '../../../../lib/theme-provider';

interface Session {
  id?: string;
  client: string;
  type: string;
  time: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
}

interface SessionItemProps {
  session: Session;
  onClick?: (session: Session) => void;
}

export const SessionItem = ({ session, onClick }: SessionItemProps) => {
  const { colors } = useTheme();

  const handleClick = () => {
    onClick?.(session);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-3 ${colors.hover} rounded-lg transition-colors cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className={`${colors.text} text-sm font-medium`}>
            {session.client}
          </p>
          {session.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              {session.status === 'upcoming' ? 'À venir' : 
               session.status === 'completed' ? 'Terminé' : 'Annulé'}
            </span>
          )}
        </div>
        <p className={`${colors.textSecondary} text-xs`}>
          {session.type}
        </p>
      </div>
      <span className={`${colors.textSecondary} text-xs font-medium`}>
        {session.time}
      </span>
    </div>
  );
};