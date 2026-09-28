import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  Laptop,
  Globe,
  Trash2,
  Database,
  Cpu,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { ConfirmationDialog } from './ConfirmationDialog';
import { t } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  historyCount: number;
  onClearHistory: () => void;
  hasGeminiKey: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  historyCount,
  onClearHistory,
  hasGeminiKey,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        id="settings-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs animate-fade-in"
      >
        <div className="relative w-full max-w-lg bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 dark:text-white">
                Application Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. Theme Configuration */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              Appearance & Theme
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <Moon className="w-5 h-5 text-emerald-400" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange('system')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* 2. Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Language / భాష / भाषा</span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Instant Switch
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  language === 'en'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <span>English</span>
                <span className="text-[10px] font-normal text-emerald-600/70 dark:text-emerald-400/60">Default</span>
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange('te')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  language === 'te'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <span>తెలుగు</span>
                <span className="text-[10px] font-normal text-emerald-600/70 dark:text-emerald-400/60">Telugu</span>
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 dark:border-emerald-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[10px] font-normal text-emerald-600/70 dark:text-emerald-400/60">Hindi</span>
              </button>
            </div>
          </div>

          {/* 3. AI Service & Storage Status */}
          <div className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-800/80 dark:text-emerald-300/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Vision AI Engine
              </span>
              <span className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.7 Flash
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
              <span className="text-emerald-800/80 dark:text-emerald-300/80 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Saved Crop Records
              </span>
              <span className="font-bold text-emerald-950 dark:text-emerald-100">
                {historyCount} items in localStorage
              </span>
            </div>
          </div>

          {/* 4. Local Storage Reset */}
          <div className="pt-2">
            <button
              type="button"
              disabled={historyCount === 0}
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 px-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 disabled:opacity-40 font-bold rounded-2xl text-xs border border-rose-200 dark:border-rose-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('clearHistory', language)}</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        title="Clear Analysis History?"
        message="This will remove all saved crop analysis records and thumbnails from your local browser storage. This action cannot be undone."
        confirmLabel="Clear All Records"
        onConfirm={() => {
          onClearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
        isDestructive={true}
      />
    </>
  );
};
