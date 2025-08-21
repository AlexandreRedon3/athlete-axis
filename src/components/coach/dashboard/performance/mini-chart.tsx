// src/components/coach/dashboard/performance/mini-chart.tsx
"use client"
import React from 'react';

import { useTheme } from '../../../../lib/theme-provider';

interface ChartData {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

interface MiniChartProps {
  data: ChartData;
  animated?: boolean;
}

export const MiniChart = ({ data, animated = true }: MiniChartProps) => {
  const { colors } = useTheme();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`${colors.textSecondary} text-xs`}>{data.label}</span>
        <span className={`${colors.text} text-xs font-medium`}>{data.value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`${data.color} h-1.5 rounded-full ${animated ? 'transition-all duration-500' : ''}`}
          style={{ width: `${data.percentage}%` }}
        ></div>
      </div>
    </div>
  );
};