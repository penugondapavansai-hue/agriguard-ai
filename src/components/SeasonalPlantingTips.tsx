import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  Search,
  Droplets,
  Thermometer,
  Clock,
  ShieldCheck,
  FlaskConical,
  Bug,
  Leaf,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info,
  Scan,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Compass,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  SEASONAL_GUIDE_DATA,
  getGuideForMonth,
  SeasonalCrop,
  ChemicalPestControl,
  MonthSeasonalGuide,
} from '../data/seasonalData';
import { SAMPLE_CROPS } from '../data/sampleData';
import { Language, SampleCropData } from '../types';
import { t } from '../utils/translations';

interface SeasonalPlantingTipsProps {
  onStartDetect: (sampleSpecimen?: SampleCropData) => void;
  language?: Language;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SeasonalPlantingTips: React.FC<SeasonalPlantingTipsProps> = ({
  onStartDetect,
  language = 'en',
}) => {
  const currentRealMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentRealMonth);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  // Tank Dosage Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [tankSizeLitres, setTankSizeLitres] = useState<number>(15);
  const [selectedChemicalForCalc, setSelectedChemicalForCalc] = useState<{
    cropName: string;
    chemical: ChemicalPestControl;
  } | null>(null);

  const currentGuide: MonthSeasonalGuide = useMemo(() => {
    return getGuideForMonth(selectedMonth);
  }, [selectedMonth]);

  // Filter crops based on category and search
  const filteredCrops = useMemo(() => {
    return currentGuide.recommendedCrops.filter((crop) => {
      const matchesCategory =
        activeCategory === 'all' || crop.category === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inName = crop.name.toLowerCase().includes(q);
      const inTelugu = crop.teluguName.toLowerCase().includes(q);
      const inHindi = crop.hindiName.toLowerCase().includes(q);
      const inScientific = crop.scientificName.toLowerCase().includes(q);
      const inPests = crop.keyPestsAndDiseases.some((p) => p.toLowerCase().includes(q));
      const inChemicals = crop.chemicalControls.some(
        (c) =>
          c.chemicalName.toLowerCase().includes(q) ||
          c.activeIngredient.toLowerCase().includes(q) ||
          c.targetPest.toLowerCase().includes(q) ||
          c.tradeNames.some((tn) => tn.toLowerCase().includes(q))
      );
      const inBio = crop.preventativeMeasures.some(
        (b) => b.name.toLowerCase().includes(q) || b.instruction.toLowerCase().includes(q)
      );

      return inName || inTelugu || inHindi || inScientific || inPests || inChemicals || inBio;
    });
  }, [currentGuide, activeCategory, searchQuery]);

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const handleStartCropDetection = (crop: SeasonalCrop) => {
    // If we have a sampleCropId matching SAMPLE_CROPS, pass that sample specimen
    if (crop.sampleCropId) {
      const match = SAMPLE_CROPS.find((s) => s.id === crop.sampleCropId);
      if (match) {
        onStartDetect(match);
        return;
      }
    }
    // Fallback: start detect
    onStartDetect();
  };

  const getLocalizedCropName = (crop: SeasonalCrop) => {
    if (language === 'te') return `${crop.teluguName} (${crop.name})`;
    if (language === 'hi') return `${crop.hindiName} (${crop.name})`;
    return crop.name;
  };

  // Helper to parse numerical rate from dosage string (e.g. "0.4 - 0.5 ml / liter")
  const calculateTotalDosage = (dosageStr: string, tankLiters: number) => {
    const match = dosageStr.match(/([\d.]+)\s*(?:-\s*([\d.]+))?\s*(ml|g)/i);
    if (!match) return dosageStr;
    const low = parseFloat(match[1]);
    const high = match[2] ? parseFloat(match[2]) : null;
    const unit = match[3];

    if (high) {
      const calcLow = (low * tankLiters).toFixed(1);
      const calcHigh = (high * tankLiters).toFixed(1);
      return `${calcLow} - ${calcHigh} ${unit} for ${tankLiters}L tank`;
    } else {
      const total = (low * tankLiters).toFixed(1);
      return `${total} ${unit} for ${tankLiters}L tank`;
    }
  };

  return (
    <section id="seasonal-planting-tips-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header & Month Navigator */}
      <div className="bg-white dark:bg-[#132017] border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('seasonalTipsTitle', language)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentGuide.monthName} Sowing & Pest Defense Guide
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1">
              {t('seasonalTipsSubtitle', language)}
            </p>
          </div>

          {/* Month Quick Control & Reset */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 py-1 text-center min-w-[120px]">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {currentGuide.monthName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  {selectedMonth === currentRealMonth ? '★ Active Now' : 'Seasonal View'}
                </div>
              </div>
              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {selectedMonth !== currentRealMonth && (
              <button
                onClick={() => setSelectedMonth(currentRealMonth)}
                className="px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Jump to Current ({MONTH_NAMES[currentRealMonth]})</span>
              </button>
            )}

            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                showCalculator
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Chemical Tank Calculator</span>
            </button>
          </div>
        </div>

        {/* 2. Month Selector Horizontal Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center gap-1.5 min-w-max">
            {MONTH_NAMES.map((mName, idx) => {
              const isSelected = selectedMonth === idx;
              const isCurrent = currentRealMonth === idx;
              return (
                <button
                  key={mName}
                  onClick={() => setSelectedMonth(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm font-bold scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <span>{mName.substring(0, 3)}</span>
                  {isCurrent && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-emerald-500 animate-pulse'
                      }`}
                      title="Current Month"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Monthly Agro-Climatic Advisory Strip */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{currentGuide.seasonBadge}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentGuide.climateOverview}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Monthly Pest & Weather Risks</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              {currentGuide.primaryFieldAdvisory.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Early Preventative Tasks</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              {currentGuide.keyPreventativeSteps.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tank Chemical Dosage Calculator Modal/Panel */}
      {showCalculator && (
        <div className="mb-6 p-5 sm:p-6 bg-slate-900 text-white rounded-3xl border border-emerald-500/30 shadow-xl animate-fade-in relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Sprayer Tank Dosage Calculator</h3>
                <p className="text-xs text-slate-400">Calculate exact chemical quantities based on your sprayer tank capacity.</p>
              </div>
            </div>

            {/* Tank Size Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tank Capacity:</span>
              {[10, 15, 16, 20, 200].map((liters) => (
                <button
                  key={liters}
                  onClick={() => setTankSizeLitres(liters)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tankSizeLitres === liters
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {liters} L
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-300 mb-3">
              Calculated for a <span className="font-bold text-emerald-400">{tankSizeLitres} Liter</span> knapsack / drum sprayer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentGuide.recommendedCrops.flatMap((c) =>
                c.chemicalControls.map((chem, chemIdx) => (
                  <div
                    key={`${c.id}-${chemIdx}`}
                    className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs"
                  >
                    <div className="font-bold text-emerald-300 truncate">{chem.chemicalName}</div>
                    <div className="text-[11px] text-slate-400 truncate mb-1.5">For {c.name} ({chem.targetPest})</div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Tank Amount:</span>
                      <span className="font-bold text-amber-300">
                        {calculateTotalDosage(chem.dosage, tankSizeLitres)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: t('allCategories', language) },
            { id: 'vegetables', label: t('vegetables', language) },
            { id: 'cereals', label: t('cereals', language) },
            { id: 'pulses', label: t('pulses', language) },
            { id: 'fruits', label: t('fruits', language) },
            { id: 'commercial', label: t('commercial', language) },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-[#132017] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/40 hover:border-emerald-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px] sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchCropPlaceholder', language)}
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#132017] border border-slate-200 dark:border-emerald-900/40 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 5. Crop Recommendation Cards Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white dark:bg-[#132017] border border-slate-200 dark:border-emerald-900/30 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No crops found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or select "All Categories" to view all recommended crops for {currentGuide.monthName}.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCrops.map((crop) => {
            const isExpanded = expandedCropId === crop.id;
            return (
              <div
                key={crop.id}
                className="bg-white dark:bg-[#132017] border border-emerald-100/80 dark:border-emerald-900/40 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Crop Header Summary Bar */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {getLocalizedCropName(crop)}
                        </h3>
                        <span className="text-[11px] font-medium italic text-slate-500 dark:text-slate-400">
                          {crop.scientificName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {crop.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Quick Specs Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{crop.harvestDurationDays}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>{crop.waterRequirement} Water</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                      <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                      <span>{crop.idealTemperature}</span>
                    </div>

                    <button
                      onClick={() => handleStartCropDetection(crop)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>{t('scanCropAction', language)}</span>
                    </button>
                  </div>
                </div>

                {/* Pest Alerts Strip */}
                <div className="px-5 sm:px-6 py-3 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/20 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                    <Bug className="w-3.5 h-3.5" />
                    <span>{currentGuide.monthName} Pest Vulnerabilities:</span>
                  </span>
                  {crop.keyPestsAndDiseases.map((pest, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-[11px] font-medium"
                    >
                      {pest}
                    </span>
                  ))}
                </div>

                {/* Main Content: Chemicals & Preventative Solutions */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Recommended Pest Control Chemicals (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        <FlaskConical className="w-4 h-4 text-emerald-600" />
                        <span>{t('pestChemicalsTitle', language)}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Targeted active ingredients
                      </span>
                    </div>

                    <div className="space-y-3">
                      {crop.chemicalControls.map((chem, chemIdx) => (
                        <div
                          key={chemIdx}
                          className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{chem.chemicalName}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    chem.safetyLevel.includes('Green')
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                      : chem.safetyLevel.includes('Blue')
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  }`}
                                >
                                  {chem.safetyLevel}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Trade Brands: <span className="font-semibold text-slate-700 dark:text-slate-300">{chem.tradeNames.join(', ')}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                <Clock className="w-3 h-3" />
                                <span>PHI: {chem.preHarvestIntervalDays} days</span>
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/40 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[11px]">{t('targetPestLabel', language)}:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {chem.targetPest}
                              </span>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[11px]">{t('dosageLabel', language)}:</span>
                              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                {chem.dosage}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2.5 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{chem.applicationTips}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Preventative, Bio-Defense & Sowing Specs (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{t('preventativeTitle', language)}</span>
                    </div>

                    <div className="space-y-3">
                      {crop.preventativeMeasures.map((prev, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-900 dark:text-emerald-200">
                              {prev.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                              {prev.type}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {prev.instruction}
                          </p>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span>Timing: {prev.timing}</span>
                          </div>
                        </div>
                      ))}

                      {/* Soil & Sowing Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Agronomic Planting Parameters</span>
                        </div>
                        <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Sowing Window:</span>{' '}
                            {crop.sowingWindow}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Ideal Soil:</span>{' '}
                            {crop.soilType}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Chemical Handling & Safety Protocol Notice */}
      <div className="mt-8 p-6 bg-emerald-900 text-white rounded-3xl relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-800/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe & Responsible Crop Chemical Protocol</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold">
              Protect Your Health, Beneficial Pollinators & Soil Biology
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              Always adhere to the specified Pre-Harvest Interval (PHI) before picking produce. Wear nitrile gloves, protective eyewear, and masks during spray preparation. Avoid spraying during midday sun or windy conditions to prevent drift and protect honeybees.
            </p>
          </div>

          <button
            onClick={() => onStartDetect()}
            className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Crop Symptoms Now</span>
          </button>
        </div>
      </div>
    </section>
  );
};
