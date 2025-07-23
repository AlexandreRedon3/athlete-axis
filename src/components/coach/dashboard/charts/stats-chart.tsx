"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../../../lib/theme-provider';

interface StatsData {
  name: string;
  value: number;
  percentage?: number;
}

interface StatsChartProps {
  data: StatsData[];
  type?: 'bar' | 'pie';
}

export const StatsChart = ({ data, type = 'bar' }: StatsChartProps) => {
  const { theme } = useTheme();
  
  const colors = [
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#f97316'  // orange-500
  ];

  if (type === 'pie') {
    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '8px',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          />
          <XAxis 
            dataKey="name" 
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
          <Bar 
            dataKey="value" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};