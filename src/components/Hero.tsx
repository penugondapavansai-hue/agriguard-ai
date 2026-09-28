import React from 'react';
import {
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Leaf,
  Scan,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface HeroProps {
  onStartDetect: () => void;
  onScrollToHowItWorks: () => void;
  language?: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onStartDetect,
  onScrollToHowItWorks,
  language = 'en',
}) => {
  return (
    <section id="hero-section" className="relative pt-6 pb-16 sm:pb-20 overflow-hidden">
      {/* Subtle Geometric Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Small Geometric Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('badgeAi', language)}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-emerald-950 dark:text-white tracking-tight leading-[1.12]">
              Smarter Crop Protection Starts With a{' '}
              <span className="text-emerald-600 dark:text-emerald-400">
                Photo.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-emerald-800/80 dark:text-emerald-200/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('heroSubtext', language)}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                id="hero-analyze-cta-btn"
                onClick={onStartDetect}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-600/20 dark:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{t('ctaAnalyze', language)}</span>
              </button>

              <button
                id="hero-how-it-works-btn"
                onClick={onScrollToHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-[#142017] hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold rounded-xl text-sm sm:text-base border border-emerald-200 dark:border-emerald-800 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('ctaHowItWorks', language)}</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multimodal Gemini 3.7 Vision</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Safe IPM Recommendations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Private Local Storage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Geometric Balance details */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md bg-white dark:bg-[#142017] rounded-3xl p-5 border border-emerald-100 dark:border-emerald-900/60 shadow-sm overflow-hidden group">
              {/* Top status bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 tracking-wide uppercase text-[11px]">
                    LIVE SCANNER
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  GEMINI_VISION_READY
                </span>
              </div>

              {/* Specimen Viewport */}
              <div className="relative aspect-4/3 rounded-2xl bg-emerald-950 overflow-hidden border border-emerald-900/50">
                {/* SVG Visual Graphic */}
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="400" height="300" fill="#0c130e" />
                  
                  {/* Stem and Foliage */}
                  <path
                    d="M200,300 C190,200 170,120 150,40"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Left leaf (Affected) */}
                  <path
                    d="M175,170 C100,150 70,80 130,50 C180,60 175,170 175,170 Z"
                    fill="#15803d"
                    opacity="0.9"
                  />
                  {/* Right leaf (Healthy) */}
                  <path
                    d="M185,130 C260,110 310,60 260,30 C210,40 185,130 185,130 Z"
                    fill="#059669"
                    opacity="0.85"
                  />

                  {/* Pest mark dots on left leaf */}
                  <circle cx="120" cy="80" r="5" fill="#f59e0b" />
                  <circle cx="140" cy="95" r="4" fill="#ef4444" />
                  <circle cx="110" cy="110" r="4.5" fill="#f59e0b" />

                  {/* AI Detection Reticle */}
                  <rect
                    x="90"
                    y="55"
                    width="70"
                    height="70"
                    rx="8"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </svg>

                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[scan_2.5s_ease-in-out_infinite]" />

                {/* Floating Tag */}
                <div className="absolute top-3 left-3 bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                  <Scan className="w-3 h-3 text-emerald-400" />
                  <span>Tomato Leaf Curl</span>
                </div>
              </div>

              {/* Mini Sample Output Card */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                    Tomato (Solanum lycopersicum)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    84% Confidence
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-200/70">
                  Observed upward leaf curling and small sap-sucking nymphs.
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-semibold border-t border-emerald-100 dark:border-emerald-900/60">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">MODERATE SEVERITY</span>
                  <span className="text-emerald-700 dark:text-emerald-400">IPM Plan Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
