// src/components/coach/dashboard/ui/quick-action-button.tsx
"use client"
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const QuickActionButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false
}: QuickActionButtonProps) => {
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        rounded-lg flex items-center justify-center space-x-2 font-medium 
        transition-colors border
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
      `}
    >
      <Icon className={iconSizes[size]} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};