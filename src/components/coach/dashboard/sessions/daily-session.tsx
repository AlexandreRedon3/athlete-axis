// src/components/coach/dashboard/sessions/daily-sessions.tsx
"use client"

import { SessionItem } from './session-item';
import { useTheme } from '../../../../lib/theme-provider';

export interface Session {
  id?: string;
  client: string;
  type: string;
  time: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
}

interface DailySessionsProps {
  sessions: Session[];
  date?: string;
  onViewCalendar?: () => void;
  onSessionClick?: (session: Session) => void;
}

export const DailySessions = ({ 
  sessions, 
  date = "Mardi, 20 Mai 2025", 
  onViewCalendar,
  onSessionClick 
}: DailySessionsProps) => {
  const { colors } = useTheme();

  return (
    <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`${colors.text} text-sm font-bold`}>Aujourd'hui</h2>
        <span className={`${colors.textSecondary} text-xs`}>{date}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <SessionItem 
              key={session.id || index} 
              session={session} 
              onClick={onSessionClick}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <p className={`${colors.textSecondary} text-sm`}>
              Aucune séance prévue aujourd'hui
            </p>
          </div>
        )}
      </div>
      
      <button 
        onClick={onViewCalendar}
        className="w-full text-emerald-600 hover:text-emerald-700 text-xs font-medium py-2 border-2 border-dashed border-emerald-200 rounded-lg transition-colors"
      >
        Voir le calendrier complet
      </button>
    </div>
  );
};