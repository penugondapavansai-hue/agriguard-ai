import React from 'react';
import { Sprout, Heart, PhoneCall, ShieldAlert, Sparkles, Globe } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface FooterProps {
  onNavigate: (tab: 'home' | 'detect' | 'plant-care' | 'history' | 'community' | 'about') => void;
  onOpenSettings: () => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSettings, language = 'en' }) => {
  return (
    <footer
      id="main-app-footer"
      className="bg-white dark:bg-[#142017] text-[#1A2E1A] dark:text-[#E2ECE1] border-t border-emerald-100 dark:border-emerald-900/60 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-sm">
                🌱
              </div>
              <span className="text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                AgriGuard <span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70 max-w-sm leading-relaxed">
              Empowering farmers, agricultural students, and agronomists with responsible, AI-powered pest and crop disease detection to safeguard global harvests sustainably.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Gemini Multimodal Vision AI</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-900 dark:text-emerald-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  {t('navHome', language)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('detect')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  {t('navDetect', language)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plant-care')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  Plant Care & Encyclopedia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  Community Forum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  {t('navHistory', language)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  {t('navAbout', language)}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSettings}
                  className="text-emerald-700/80 dark:text-emerald-300/80 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer"
                >
                  {t('navSettings', language)}
                </button>
              </li>
            </ul>
          </div>

          {/* Agriculture Helplines */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Advisory Helplines</span>
            </h4>
            <ul className="space-y-2 text-xs text-emerald-800/80 dark:text-emerald-300/80">
              <li>
                <span className="text-emerald-950 dark:text-emerald-100 block font-semibold">Kisan Call Centre:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">1800-180-1551</span>
              </li>
              <li>
                <span className="text-emerald-950 dark:text-emerald-100 block font-semibold">KVK Extension Portal:</span>
                <span>kvk.icar.gov.in</span>
              </li>
              <li>
                <span className="text-emerald-950 dark:text-emerald-100 block font-semibold">FAO Locust Watch:</span>
                <span>fao.org/ag/locusts</span>
              </li>
            </ul>
          </div>

          {/* Safety & Policy */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Advisory Standards</span>
            </h4>
            <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
              AgriGuard AI generates non-chemical, IPM-centric advice. Never apply hazardous pesticides without consulting licensed agronomists.
            </p>
          </div>
        </div>

        {/* Bottom Bar with Geometric Balance Pulse Indicator */}
        <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-700/70 dark:text-emerald-400/60 font-medium">
          <div className="flex gap-6">
            <span>© {new Date().getFullYear()} AgriGuard AI</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">System Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
