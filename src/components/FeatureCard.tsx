import React from 'react';
import { Bot, Search, Lightbulb, Smartphone, ShieldCheck } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Vision',
      description: "Analyze crop images using Gemini's multimodal AI with strict agricultural safety prompts.",
      tag: 'Gemini 3.7 Vision',
      color: 'emerald',
    },
    {
      icon: Search,
      title: 'Visual Analysis',
      description: 'Identify visible symptoms, foliar patterns, and possible pest problems from leaves, stems, or fruits.',
      tag: 'Symptom Breakdown',
      color: 'teal',
    },
    {
      icon: Lightbulb,
      title: 'Practical Guidance',
      description: 'Get easy-to-understand biological, physical, and IPM prevention and monitoring suggestions.',
      tag: 'Safe Action Steps',
      color: 'amber',
    },
    {
      icon: Smartphone,
      title: 'Farmer Friendly',
      description: 'Designed to work smoothly on Android phones, tablets and low-bandwidth rural conditions.',
      tag: 'Responsive & Fast',
      color: 'sky',
    },
  ];

  return (
    <section id="features-section" className="py-16 sm:py-24 border-t border-emerald-100 dark:border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Intelligent Agronomy Features
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold text-emerald-950 dark:text-white tracking-tight">
            Designed for Field-Ready Crop Protection
          </h3>
          <p className="text-sm sm:text-base text-emerald-800/80 dark:text-emerald-200/70">
            Every analysis provides grounded, safe, and actionable insights to protect crop yields sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                className="group bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950 dark:text-white tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    {feature.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
