import React from 'react';
import { ConfidenceLevel } from '../types';
import { HelpCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number;
  level: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  level,
  size = 'md',
}) => {
  const normalized = Math.min(100, Math.max(0, confidence));

  const getColor = () => {
    if (normalized >= 80) return { stroke: '#059669', bg: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' };
    if (normalized >= 60) return { stroke: '#10b981', bg: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60' };
    if (normalized >= 40) return { stroke: '#d97706', bg: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800' };
    return { stroke: '#dc2626', bg: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800' };
  };

  const colors = getColor();

  // Circle dimensions
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const radius = size === 'sm' ? 24 : size === 'lg' ? 46 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  const viewBoxSize = (radius + strokeWidth) * 2;
  const center = radius + strokeWidth;

  return (
    <div id="confidence-meter-container" className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-emerald-100 dark:text-emerald-950"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center percentage label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-base'} text-emerald-950 dark:text-white`}>
            {normalized}%
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colors.badge}`}>
            {level}
          </span>
        </div>
        <span className="text-[11px] text-emerald-800/70 dark:text-emerald-400/60 mt-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 inline text-emerald-600 dark:text-emerald-400" />
          Model visual certainty
        </span>
      </div>
    </div>
  );
};
