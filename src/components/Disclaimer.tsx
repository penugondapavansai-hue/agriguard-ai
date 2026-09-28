import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface DisclaimerProps {
  language?: Language;
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ language = 'en', compact = false }) => {
  return (
    <div
      id="agricultural-disclaimer-card"
      className={`rounded-xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 transition-all ${
        compact ? 'p-3.5 text-xs' : 'p-4 md:p-5 text-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold tracking-wide text-xs uppercase text-amber-800 dark:text-amber-300">
              {t('disclaimerTitle', language)}
            </h4>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-medium">
              <ShieldCheck className="w-3 h-3" /> Advisory Only
            </span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
            {t('disclaimerText', language)}
          </p>
        </div>
      </div>
    </div>
  );
};
