// src/components/coach/dashboard/performance/performance-panel.tsx
"use client"

import { Calendar,Plus } from 'lucide-react';

import { useTheme } from '../../../../lib/theme-provider';
import { QuickActionButton } from '../ui/quick-action-button';
import { MiniChart } from './mini-chart';

interface PerformanceData {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

interface PerformancePanelProps {
  data: PerformanceData[];
  title?: string;
  onNewClient?: () => void;
  onScheduleSession?: () => void;
}

export const PerformancePanel = ({ 
  data, 
  title = "Performance cette semaine",
  onNewClient,
  onScheduleSession 
}: PerformancePanelProps) => {
  const { colors } = useTheme();

  return (
    <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
      <h2 className={`${colors.text} text-sm font-bold mb-3`}>{title}</h2>
      
      <div className="space-y-4 mb-4">
        {data.map((item, index) => (
          <MiniChart key={index} data={item} />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <QuickActionButton 
          icon={Plus} 
          label="Nouveau client"
          variant="secondary"
          onClick={onNewClient}
          fullWidth
        />
        <QuickActionButton 
          icon={Calendar} 
          label="Planifier séance"
          variant="secondary"
          onClick={onScheduleSession}
          fullWidth
        />
      </div>
    </div>
  );
};