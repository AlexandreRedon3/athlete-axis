// src/components/coach/dashboard/clients/client-row.tsx
"use client"

import React from 'react';

import { useTheme } from '../../../../lib/theme-provider';

interface Client {
  id?: string;
  name: string;
  program: string;
  progress: number;
}

interface ClientRowProps {
  client: Client;
  onViewDetails?: (client: Client) => void;
}

export const ClientRow = ({ client, onViewDetails }: ClientRowProps) => {
  const { colors } = useTheme();

  const handleViewDetails = () => {
    onViewDetails?.(client);
  };

  return (
    <tr className={`${colors.hover} transition-colors`}>
      <td className={`px-4 py-3 ${colors.text} text-sm font-medium`}>
        {client.name}
      </td>
      <td className={`px-4 py-3 ${colors.textSecondary} text-sm`}>
        {client.program}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${client.progress}%` }}
            ></div>
          </div>
          <span className={`${colors.textSecondary} text-xs`}>
            {client.progress}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button 
          onClick={handleViewDetails}
          className="text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors"
        >
          Détails
        </button>
      </td>
    </tr>
  );
};