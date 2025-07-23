// src/components/coach/dashboard/clients/clients-table.tsx
"use client"

import { ClientRow } from './clients-row';
import { useTheme } from '../../../../lib/theme-provider';

export interface Client {
  id?: string;
  name: string;
  program: string;
  progress: number;
}

interface ClientsTableProps {
  clients: Client[];
  onViewAll?: () => void;
  onViewDetails?: (client: Client) => void;
}

export const ClientsTable = ({ clients, onViewAll, onViewDetails }: ClientsTableProps) => {
  const { colors } = useTheme();

  return (
    <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`${colors.text} text-sm font-bold`}>Clients récents</h2>
        <button 
          onClick={onViewAll}
          className="text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors"
        >
          Voir tous
        </button>
      </div>
      
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className={`${colors.border} border-b`}>
              <th className={`${colors.textSecondary} text-left text-xs font-medium py-2 px-4`}>
                Nom
              </th>
              <th className={`${colors.textSecondary} text-left text-xs font-medium py-2 px-4`}>
                Programme
              </th>
              <th className={`${colors.textSecondary} text-left text-xs font-medium py-2 px-4`}>
                Progression
              </th>
              <th className={`${colors.textSecondary} text-left text-xs font-medium py-2 px-4`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <ClientRow 
                key={client.id || index} 
                client={client} 
                onViewDetails={onViewDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};