"use client"
import { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import React from 'react';

import { useTheme } from '../../../../lib/theme-provider';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  gradient: string;
}

export const StatsCard = ({ title, value, change, icon: Icon, gradient }: StatsCardProps) => {
  const { colors } = useTheme();

  return (
    <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${colors.textSecondary} text-xs font-medium mb-1`}>{title}</p>
          <p className={`${colors.text} text-xl font-bold`}>{value}</p>
          {change && (
            <p className="text-xs mt-1 flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{change}%
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${gradient}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};