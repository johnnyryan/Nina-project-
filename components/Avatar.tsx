
import React from 'react';
import { COLORS } from '../constants';

interface AvatarProps {
  icon: string;
  rank?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ icon, rank, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-7xl'
  };

  const ribbonSizeClasses = {
    sm: 'w-5 h-5 text-[10px] -right-1 -bottom-1',
    md: 'w-7 h-7 text-xs -right-1 -bottom-1',
    lg: 'w-10 h-10 text-lg -right-2 -bottom-2',
    xl: 'w-14 h-14 text-2xl -right-3 -bottom-3'
  };

  const ribbonColors = {
    1: COLORS.gold,
    2: COLORS.silver,
    3: COLORS.bronze
  };

  const ribbonIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-[1.2rem] bg-emerald-50 border-2 border-emerald-100 shadow-sm ${sizeClasses[size]} ${className}`}>
      {icon}
      {rank && rank >= 1 && rank <= 3 && (
        <div 
          className={`absolute rounded-full border-2 border-white shadow-md flex items-center justify-center text-white ${ribbonSizeClasses[size]}`}
          style={{ backgroundColor: ribbonColors[rank as 1|2|3] }}
        >
          {ribbonIcons[rank as 1|2|3]}
        </div>
      )}
    </div>
  );
};
