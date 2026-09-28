import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  BookOpen,
  PhoneCall,
  Leaf,
  Sparkles,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Language } from '../types';
import { Disclaimer } from '../components/Disclaimer';
import { t } from '../utils/translations';

interface AboutPageProps {
  language?: Language;
  onStartDetect: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language = 'en', onStartDetect }) => {
  return (
    <div id="about-page-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Hero Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs">
          <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Identify. Understand. Protect.</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-emerald-950 dark:text-white tracking-tight leading-tight">
          Empowering Sustainable Agronomy with Vision AI
        </h1>
        <p className="text-base sm:text-lg text-emerald-800/80 dark:text-emerald-200/70 leading-relaxed font-normal">
          AgriGuard AI provides accessible, multimodal diagnostic intelligence to farmers, agronomy students, and extension workers — helping identify crop distress early, reduce avoidable pesticide use, and build resilient agro-ecosystems.
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
            Multimodal Vision
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
            Utilizes Google's Gemini 3.7 Flash model to analyze intricate botanical features, lesion geometry, foliar chlorosis, and pest morphology directly from field photos.
          </p>
        </div>

        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
            IPM First Philosophy
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
            Prioritizes biological, cultural, mechanical, and botanical remedies over chemical inputs to preserve soil health, beneficial pollinators, and farm profitability.
          </p>
        </div>

        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
            Ethical Safety Guardrails
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
            Strict AI system instructions prohibit dangerous chemical dosage instructions and clearly state confidence limits to avoid hazardous field misuse.
          </p>
        </div>
      </div>

      {/* Integrated Pest Management (IPM) Hierarchy Guide */}
      <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-950 dark:text-white">
              The IPM Decision Hierarchy
            </h3>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
              Responsible agricultural disease management protocols
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
              1. Cultural Control
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70">
              Crop rotation, optimal planting distance, intercropping, and proper drip irrigation to minimize fungal conditions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
              2. Physical & Mechanical
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70">
              Hand-picking egg clusters, installing yellow sticky traps, pheromone lures, and sanitizing pruning shears.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
              3. Biological Solutions
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70">
              Beneficial predators (Ladybird beetles, Trichogramma wasps, Chrysoperla), and botanical sprays (Neem oil 1500ppm).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
            <div className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wide">
              4. Chemical (Last Resort)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Only applied when economic threshold levels (ETL) are breached, strictly under the direction of licensed extension officers.
            </p>
          </div>
        </div>
      </div>

      {/* Official Agronomy Resources & Helplines */}
      <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <PhoneCall className="w-4 h-4" />
          <span>Agricultural Extension & Advisory Contacts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 space-y-1">
            <span className="font-bold text-emerald-950 dark:text-white block">
              Kisan Call Centre (India)
            </span>
            <p className="text-emerald-800/70 dark:text-emerald-300/70">Toll-Free Farmer Assistance Hotline (22 regional languages)</p>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold block pt-1">
              📞 1800-180-1551
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 space-y-1">
            <span className="font-bold text-emerald-950 dark:text-white block">
              ICAR & Krishi Vigyan Kendra Network
            </span>
            <p className="text-emerald-800/70 dark:text-emerald-300/70">730+ District Agricultural Science Centers</p>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
              🌐 kvk.icar.gov.in
            </span>
          </div>
        </div>
      </div>

      {/* Global Agriculture Disclaimer */}
      <Disclaimer language={language} />
    </div>
  );
};
