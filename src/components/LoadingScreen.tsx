import React, { useState, useEffect } from 'react';
import { Leaf, Scan, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface LoadingScreenProps {
  imageSrc?: string;
  language?: Language;
}

const UI_MESSAGES = [
  'Examining visible symptoms...',
  'Checking for possible pest patterns...',
  'Evaluating leaf tissue indicators...',
  'Preparing safe IPM recommendations...',
  'Formulating your crop report...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ imageSrc, language = 'en' }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Cycle friendly UI messages
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % UI_MESSAGES.length);
    }, 2200);

    // Simulate smooth progress bar (capped at 92% until completion)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.floor(Math.random() * 12) + 4;
        return 92;
      });
    }, 400);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div
      id="crop-analysis-loading-screen"
      className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-8 sm:p-12 text-center shadow-xs max-w-xl mx-auto space-y-8 animate-fade-in"
    >
      {/* Specimen View with Laser Scan Effect */}
      <div className="relative w-48 sm:w-56 aspect-square mx-auto rounded-2xl overflow-hidden bg-emerald-950 border-2 border-emerald-500/50 shadow-lg">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Crop being analyzed"
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-400 bg-emerald-950">
            <Leaf className="w-16 h-16 animate-pulse" />
          </div>
        )}

        {/* Animated Laser Scanning Beam */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[scan_2s_ease-in-out_infinite]" />

        {/* Scanning Reticle Grid */}
        <div className="absolute inset-0 border border-emerald-500/30 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-emerald-500/20" />
          <div className="border-r border-b border-emerald-500/20" />
          <div className="border-b border-emerald-500/20" />
          <div className="border-r border-b border-emerald-500/20" />
          <div className="border-r border-b border-emerald-500/20" />
          <div className="border-b border-emerald-500/20" />
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
      </div>

      {/* Progress Text & Stage Message */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Multimodal Vision Reasoning</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white tracking-tight">
          {t('analyzingTitle', language)}
        </h3>

        <div className="h-6 flex items-center justify-center">
          <p className="text-sm font-medium text-emerald-800/80 dark:text-emerald-300/80 transition-all duration-300 animate-fade-in key={messageIndex}">
            {UI_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="space-y-2 max-w-sm mx-auto">
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/60 h-2.5 rounded-full overflow-hidden border border-emerald-100 dark:border-emerald-900/40 p-0.5">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-emerald-700/70 dark:text-emerald-400/60 font-medium px-1">
          <span>Vision Processing</span>
          <span>{progress}%</span>
        </div>
      </div>

      <p className="text-xs text-emerald-800/60 dark:text-emerald-400/50 italic max-w-xs mx-auto">
        Analyzing visual botanical features, foliar discoloration, and pest indicators.
      </p>
    </div>
  );
};
