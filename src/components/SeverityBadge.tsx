import React from 'react';
import { SeverityLevel } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showDescription?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, showDescription = false }) => {
  const getBadgeConfig = () => {
    switch (severity) {
      case 'LOW':
        return {
          label: 'LOW SEVERITY',
          icon: ShieldCheck,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          indicator: 'bg-emerald-500',
          desc: 'Limited visible symptoms. Regular preventive scouting recommended.',
        };
      case 'MODERATE':
        return {
          label: 'MODERATE SEVERITY',
          icon: AlertTriangle,
          bg: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          indicator: 'bg-amber-500',
          desc: 'Noticeable visible symptoms requiring close monitoring and IPM actions.',
        };
      case 'HIGH':
        return {
          label: 'HIGH SEVERITY',
          icon: ShieldAlert,
          bg: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
          indicator: 'bg-rose-500',
          desc: 'Significant visible damage that warrants prompt expert attention.',
        };
      case 'UNKNOWN':
      default:
        return {
          label: 'UNKNOWN SEVERITY',
          icon: HelpCircle,
          bg: 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
          indicator: 'bg-stone-400',
          desc: 'Insufficient image evidence to assess severity reliably.',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col">
      <span
        id={`severity-badge-${severity.toLowerCase()}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-xs ${config.bg}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.indicator} animate-pulse`} />
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mt-1.5 leading-relaxed">
          {config.desc}
        </p>
      )}
    </div>
  );
};
