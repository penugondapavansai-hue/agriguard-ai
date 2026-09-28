import React from 'react';
import { ShieldCheck, Lock, EyeOff, HardDrive } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface PrivacySectionProps {
  language?: Language;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ language = 'en' }) => {
  const points = [
    {
      icon: EyeOff,
      title: 'Transient Vision Processing',
      desc: 'Crop images uploaded for AI reasoning are streamed directly to the secure Gemini API endpoint and never sold or shared.',
    },
    {
      icon: HardDrive,
      title: 'Local Client-Side Storage',
      desc: 'Your analysis history and crop photos are saved strictly in your device browser storage (localStorage).',
    },
    {
      icon: Lock,
      title: 'Full User Sovereignty',
      desc: 'You can export, delete individual records, or clear your entire diagnostic history instantly with one click.',
    },
  ];

  return (
    <section id="privacy-section" className="py-12 bg-white dark:bg-[#142017] border-t border-emerald-100 dark:border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-3xl p-6 sm:p-10 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="max-w-md space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('privacyTitle', language)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white">
                Farmer Data Sovereignty & Privacy
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-200/70 leading-relaxed">
                {t('privacySubtext', language)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto flex-1">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 space-y-2 shadow-xs"
                  >
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-xs text-emerald-950 dark:text-white">
                      {pt.title}
                    </h4>
                    <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
