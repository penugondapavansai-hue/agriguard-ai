import React from 'react';
import { Camera, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface HowItWorksProps {
  language?: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ language = 'en' }) => {
  const steps = [
    {
      num: '1',
      icon: Camera,
      title: t('step1Title', language),
      desc: t('step1Desc', language),
    },
    {
      num: '2',
      icon: Sparkles,
      title: t('step2Title', language),
      desc: t('step2Desc', language),
    },
    {
      num: '3',
      icon: FileText,
      title: t('step3Title', language),
      desc: t('step3Desc', language),
    },
    {
      num: '4',
      icon: CheckCircle,
      title: t('step4Title', language),
      desc: t('step4Desc', language),
    },
  ];

  return (
    <section id="how-it-works-section" className="py-16 sm:py-24 bg-emerald-50/30 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Field Workflow
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold text-emerald-950 dark:text-white tracking-tight">
            {t('howItWorksTitle', language)}
          </h3>
          <p className="text-sm sm:text-base text-emerald-800/80 dark:text-emerald-200/70">
            A frictionless 4-step experience from field capture to sustainable agronomic intervention.
          </p>
        </div>

        {/* 4 Steps with desktop connector */}
        <div className="relative">
          {/* Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-emerald-100 dark:bg-emerald-900/60 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  id={`workflow-step-${step.num}`}
                  className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center group hover:border-emerald-500/60 transition-all duration-200"
                >
                  {/* Step Number Badge */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-950 dark:bg-white text-white dark:text-emerald-950 text-xs font-bold flex items-center justify-center border-2 border-white dark:border-emerald-950 shadow-sm">
                      {step.num}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-emerald-950 dark:text-white tracking-tight mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
