"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer,Tooltip, XAxis, YAxis } from 'recharts';

import { useTheme } from '../../../../lib/theme-provider';

interface PerformanceData {
  month: string;
  clients: number;
  programs: number;
  sessions: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const { theme } = useTheme();
  
  const chartColors = {
    clients: '#10b981', // emerald-500
    programs: '#3b82f6', // blue-500
    sessions: '#f59e0b'  // amber-500
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.clients} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColors.clients} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPrograms" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.programs} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColors.programs} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          />
          <XAxis 
            dataKey="month" 
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px',
              color: theme === 'dark' ? '#f9fafb' : '#111827'
            }}
          />
          <Area
            type="monotone"
            dataKey="clients"
            stroke={chartColors.clients}
            fillOpacity={1}
            fill="url(#colorClients)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="programs"
            stroke={chartColors.programs}
            fillOpacity={1}
            fill="url(#colorPrograms)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};