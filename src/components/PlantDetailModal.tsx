import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sun,
  Droplets,
  Sprout,
  Thermometer,
  ShieldCheck,
  Heart,
  Calendar,
  AlertTriangle,
  Scan,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Printer,
  Share2,
  Info,
  Layers,
  Scissors,
  Save,
  MessageSquare,
  Calculator,
  Compass,
  FlaskConical,
  Bug,
  Leaf,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PlantCareProfile, Language } from '../types';
import {
  getFavoritePlantIds,
  toggleFavoritePlant,
  getPlantCustomNotes,
  savePlantCustomNotes,
  askPlantSpecialist,
} from '../services/api';
import {
  getDamagedCropRescueGuides,
  DamagedCropRescueGuide,
  ChemicalPesticideItem,
} from '../data/cropPesticideEmergencyData';

interface PlantDetailModalProps {
  plant: PlantCareProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onStartScan?: (cropName: string) => void;
  language?: Language;
}

type TabType = 'overview' | 'pests' | 'schedule' | 'companions' | 'tools' | 'ai_ask';

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  isOpen,
  onClose,
  onStartScan,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Pesticide & Damage Guide State
  const [selectedDamageCategory, setSelectedDamageCategory] = useState<string>('all');
  const [tankSprayerLitres, setTankSprayerLitres] = useState<number>(15);
  const [selectedPesticideForCalc, setSelectedPesticideForCalc] = useState<ChemicalPesticideItem | null>(null);

  // Water calculator state
  const [calcLocation, setCalcLocation] = useState<'indoor_pot' | 'outdoor_bed' | 'raised_planter'>('outdoor_bed');
  const [calcClimate, setCalcClimate] = useState<'hot_dry' | 'moderate' | 'cool_humid'>('moderate');
  const [calcWaterResult, setCalcWaterResult] = useState<string>('');

  // AI Plant Q&A state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiAsking, setIsAiAsking] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    if (plant) {
      const favs = getFavoritePlantIds();
      setIsFavorite(favs.includes(plant.id));
      setUserNotes(getPlantCustomNotes(plant.id));
      setActiveTab('overview');
      setSelectedDamageCategory('all');
      setAiQuestion('');
      setAiAnswer('');
      setAiHistory([]);
    }
  }, [plant]);

  // Recalculate water requirements when parameters change
  useEffect(() => {
    if (!plant) return;
    let base = 2; // base days
    if (plant.watering.moistureLevel === 'Low') base = 7;
    if (plant.watering.moistureLevel === 'Soaked') base = 1;
    if (plant.watering.moistureLevel === 'High') base = 2;
    if (plant.watering.moistureLevel === 'Moderate') base = 3;

    if (calcLocation === 'indoor_pot') base += 2;
    if (calcLocation === 'raised_planter') base -= 0.5;

    if (calcClimate === 'hot_dry') base = Math.max(1, base - 1.5);
    if (calcClimate === 'cool_humid') base += 2;

    const rounded = Math.round(base * 10) / 10;
    if (rounded <= 1) {
      setCalcWaterResult('Water daily or maintain consistent shallow moisture');
    } else {
      setCalcWaterResult(`Water approximately once every ${rounded} days (test top soil with finger first)`);
    }
  }, [plant, calcLocation, calcClimate]);

  const rescueGuides: DamagedCropRescueGuide[] = useMemo(() => {
    if (!plant) return [];
    return getDamagedCropRescueGuides(plant.id || plant.commonName);
  }, [plant]);

  const filteredRescueGuides = useMemo(() => {
    if (selectedDamageCategory === 'all') return rescueGuides;
    return rescueGuides.filter((g) => g.damageCategory === selectedDamageCategory);
  }, [rescueGuides, selectedDamageCategory]);

  if (!isOpen || !plant) return null;

  const handleToggleFavorite = () => {
    const updated = toggleFavoritePlant(plant.id);
    setIsFavorite(updated.includes(plant.id));
  };

  const handleSaveNotes = () => {
    savePlantCustomNotes(plant.id, userNotes);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2500);
  };

  const handleAskSpecialist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiAsking) return;

    const question = aiQuestion.trim();
    setIsAiAsking(true);
    try {
      const answer = await askPlantSpecialist(plant.commonName, question, language);
      setAiAnswer(answer);
      setAiHistory((prev) => [...prev, { q: question, a: answer }]);
      setAiQuestion('');
    } catch (err: any) {
      setAiAnswer(`Error: ${err.message || 'Could not get response'}`);
    } finally {
      setIsAiAsking(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const modalJSX = (
    <div
      id="plant-detail-modal-backdrop"
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="plant-detail-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white dark:bg-[#142017] rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/60 overflow-hidden flex flex-col max-h-[92vh] animate-modal-pop"
      >
        {/* 1. Top Image Banner & Header Meta */}
        <div className="relative h-52 sm:h-60 md:h-64 w-full bg-emerald-950 shrink-0 overflow-hidden">
          <img
            src={plant.image}
            alt={plant.commonName}
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60 border-white/20'
              }`}
              title={isFavorite ? 'Remove from Saved Plants' : 'Save to My Garden'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              title="Print Care Guide Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plant Badges & Titles */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-emerald-950">
                {plant.category.replace('_', ' ')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  plant.difficulty === 'Easy'
                    ? 'bg-emerald-100 text-emerald-900'
                    : plant.difficulty === 'Moderate'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {plant.difficulty} Care
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/90 text-amber-950 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Pesticide & Damage Guide Included
              </span>
              {plant.isAiGenerated && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/80 text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini AI Dossier
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              {plant.commonName}
            </h2>
            <div className="text-xs sm:text-sm text-emerald-200/90 italic font-medium flex items-center gap-2">
              <span>{plant.scientificName}</span>
              <span>&bull;</span>
              <span>{plant.family}</span>
              {plant.origin && (
                <>
                  <span className="hidden sm:inline">&bull;</span>
                  <span className="hidden sm:inline opacity-80">{plant.origin}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Navigation Tabs Bar */}
        <div className="bg-emerald-50/90 dark:bg-[#0E1711] border-b border-emerald-100 dark:border-emerald-900/60 px-4 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2 py-2">
            {[
              { id: 'overview' as const, label: 'Care Overview', icon: Sprout },
              {
                id: 'pests' as const,
                label: '🚨 Damaged Crop & Pesticides',
                icon: FlaskConical,
                highlight: true,
                badge: 'Pesticide Rx',
              },
              { id: 'schedule' as const, label: 'Seasons & Lifecycle', icon: Calendar },
              { id: 'companions' as const, label: 'Companion Guild', icon: Layers },
              { id: 'tools' as const, label: 'Water & Notes', icon: Calculator },
              { id: 'ai_ask' as const, label: 'Ask AI Specialist', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? tab.id === 'pests'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : tab.id === 'pests'
                      ? 'text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/80 border border-amber-200 dark:border-amber-900'
                      : 'text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-amber-950 font-extrabold uppercase">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick CTA to scan this crop */}
          {onStartScan && (
            <button
              onClick={() => {
                onClose();
                onStartScan(plant.commonName);
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              title="Diagnose a sick plant of this species"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Diagnose Crop</span>
            </button>
          )}
        </div>

        {/* 3. Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#1A2E1A] dark:text-[#E2ECE1]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Short description card */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/80">
                <p className="text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                  {plant.shortDescription}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400">Growth Habit:</span>{' '}
                    {plant.growthHabit}
                  </div>
                  {plant.origin && (
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400">Native Origin:</span>{' '}
                      {plant.origin}
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Essential Vital Gauges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Sunlight */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <Sun className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                      Sunlight
                    </span>
                  </div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-white">
                    {plant.sunlight.level}
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5">
                    {plant.sunlight.hours}
                  </div>
                  <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/60 mt-2 leading-tight">
                    {plant.sunlight.description}
                  </p>
                </div>

                {/* Watering */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="flex items-center gap-2 text-sky-500 mb-2">
                    <Droplets className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                      Watering
                    </span>
                  </div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-white">
                    {plant.watering.moistureLevel} Moisture
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5">
                    Tolerance: {plant.watering.droughtTolerance} Drought
                  </div>
                  <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/60 mt-2 leading-tight">
                    {plant.watering.scheduleTips}
                  </p>
                </div>

                {/* Soil & pH */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Sprout className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                      Soil & pH
                    </span>
                  </div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-white">
                    pH {plant.soil.phRange}
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5 truncate">
                    {plant.soil.drainage}
                  </div>
                  <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/60 mt-2 leading-tight">
                    {plant.soil.type}
                  </p>
                </div>

                {/* Temperature */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-500 mb-2">
                    <Thermometer className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                      Temperature
                    </span>
                  </div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-white">
                    {plant.temperature.idealRange}
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5">
                    Humidity: {plant.temperature.humidityLevel}
                  </div>
                  <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/60 mt-2 leading-tight">
                    {plant.temperature.frostSensitive ? '⚠️ Sensitive to frost; protect below 10°C.' : '✔️ Hardy against light frosts.'}
                  </p>
                </div>
              </div>

              {/* Damaged Crop Pesticide Quick Alert Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                      Crop Damaged by Pests or Blight?
                    </h4>
                    <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-0.5">
                      View exact chemical pesticides, active ingredients, dosage per tank, organic bio-remedies, and emergency rescue steps.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('pests')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <span>Open Pesticide Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Nutrition, Staking & Pro Tips Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nutrition & Fertilizing */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Nutrition & Fertilizer Regimen</span>
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Target N-P-K Ratio:</span>{' '}
                      <span className="font-bold text-emerald-950 dark:text-white">{plant.fertilizer.npkRatio}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Feeding Frequency:</span>{' '}
                      <span>{plant.fertilizer.frequency}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Recommended Feed:</span>{' '}
                      <span>{plant.fertilizer.bestType}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs">
                      <strong>Organic Tip:</strong> {plant.fertilizer.organicTips}
                    </div>
                  </div>
                </div>

                {/* Pruning, Support & Toxicity */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-emerald-600" />
                    <span>Pruning, Staking & Support</span>
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Requires Support:</span>{' '}
                      <span>{plant.pruningAndSupport.requiresSupport ? `Yes (${plant.pruningAndSupport.supportType || 'Stakes/Cages'})` : 'No (Self-supporting)'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Pruning Season:</span>{' '}
                      <span>{plant.pruningAndSupport.pruningSeason}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800/90 dark:text-emerald-300/80">
                      {plant.pruningAndSupport.pruningTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Toxicity indicator */}
                  {plant.toxicity && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        plant.toxicity.isToxicToPets
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <strong>{plant.toxicity.isToxicToPets ? 'Pet Caution:' : 'Pet Safe:'}</strong>{' '}
                        {plant.toxicity.details || (plant.toxicity.isToxicToPets ? 'Keep away from chewing pets.' : 'Non-toxic to cats and dogs.')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PESTS, DAMAGED CROPS & PESTICIDE GUIDE */}
          {activeTab === 'pests' && (
            <div className="space-y-6 animate-fade-in">
              {/* Emergency Banner */}
              <div className="p-5 rounded-3xl bg-linear-to-r from-amber-950 via-amber-900 to-[#1A1208] text-white border border-amber-700/80 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Damaged Crop & Pesticide Decision Protocol</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      What to Spray & How to Rescue Damaged {plant.commonName}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl mt-1 leading-relaxed">
                      Follow verified agronomic pesticide formulations with exact active ingredients, tank dosage, pre-harvest safety intervals, and biological remedies.
                    </p>
                  </div>

                  {onStartScan && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartScan(plant.commonName);
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md cursor-pointer self-start sm:self-auto"
                    >
                      <Scan className="w-4 h-4" />
                      <span>Diagnose with AI Camera</span>
                    </button>
                  )}
                </div>

                {/* Interactive Sprayer Dosage Calculator Bar */}
                <div className="pt-2 border-t border-amber-800/60 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5" />
                    Sprayer Tank Capacity:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[5, 15, 20, 200].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTankSprayerLitres(size)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          tankSprayerLitres === size
                            ? 'bg-amber-500 text-amber-950'
                            : 'bg-white/10 text-amber-200 hover:bg-white/20'
                        }`}
                      >
                        {size === 200 ? '200L (Barrel/Acre)' : `${size}L (${size === 15 ? 'Backpack' : 'Pump'})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Damage Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  Damage Type:
                </span>
                <button
                  onClick={() => setSelectedDamageCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedDamageCategory === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  All Damage Categories ({rescueGuides.length})
                </button>
                {rescueGuides.map((guide, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDamageCategory(guide.damageCategory)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedDamageCategory === guide.damageCategory
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>{guide.categoryIcon}</span>{' '}
                    <span>{guide.damageCategory.split('(')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Detailed Rescue Guides Cards */}
              <div className="space-y-6">
                {filteredRescueGuides.map((guide, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-md space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xl shrink-0">
                          {guide.categoryIcon}
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-white">
                            {guide.damageCategory}
                          </h4>
                          <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                            Immediate Intervention Required
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms & Emergency 0-48h Action Plan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 space-y-2">
                        <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Visible Damage Symptoms
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-rose-950 dark:text-rose-100 leading-relaxed">
                          {guide.commonSymptoms.map((sym, sIdx) => (
                            <li key={sIdx}>{sym}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-2">
                        <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          0 - 48 Hours Rescue Protocol
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-emerald-950 dark:text-emerald-100 leading-relaxed">
                          {guide.immediateRescueSteps.map((step, stIdx) => (
                            <li key={stIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Chemical Pesticides Table / Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                          <FlaskConical className="w-4 h-4 text-amber-600" />
                          Recommended Chemical Pesticides & Active Ingredients
                        </h5>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Calculated for {tankSprayerLitres}L Tank
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                        {guide.chemicalPesticides.map((pest, pIdx) => {
                          return (
                            <div
                              key={pIdx}
                              className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-2.5 text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-bold text-sm text-emerald-950 dark:text-white">
                                    {pest.tradeName}
                                  </div>
                                  <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                                    Active: {pest.activeIngredient}
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 shrink-0">
                                  {pest.actionType}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-100 dark:border-amber-900/40">
                                <div>
                                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium">
                                    Per Litre Water:
                                  </span>
                                  <span className="font-bold text-emerald-950 dark:text-white">
                                    {pest.dosagePerLiter}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-medium">
                                    For {tankSprayerLitres}L Sprayer:
                                  </span>
                                  <span className="font-bold text-amber-950 dark:text-amber-200">
                                    {pest.dosageFor15LTank}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80">
                                <strong>Pre-Harvest Interval (PHI):</strong> {pest.phiDays} days before picking
                              </div>

                              <div className="p-2 rounded-xl bg-white dark:bg-[#142017] text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40">
                                <strong>Safety Warning:</strong> {pest.safetyWarning}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Organic Bio-Pesticide Alternatives */}
                    <div className="space-y-3 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        Organic & Biological Bio-Pesticide Alternatives
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {guide.organicBiopesticides.map((bio, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/70 text-xs space-y-1.5"
                          >
                            <div className="font-bold text-emerald-950 dark:text-white">
                              {bio.name}
                            </div>
                            <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                              Dosage: {bio.dosagePerLiter}
                            </div>
                            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-snug">
                              {bio.benefits}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Post-Damage Crop Nutrition Recovery */}
                    <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/60 text-xs space-y-1">
                      <div className="font-bold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <span>Post-Damage Regenerative Crop Recovery Nutrition</span>
                      </div>
                      <p className="text-sky-900/90 dark:text-sky-200/90 leading-relaxed">
                        {guide.nutritionalRecovery}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Species Pests list */}
              <div className="space-y-3.5 pt-4 border-t border-emerald-100 dark:border-emerald-900/60">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Specific Pathogens & Pests of {plant.commonName}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {plant.pestsAndDiseases.map((pest, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                          {pest.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            pest.type === 'pest'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                              : pest.type === 'fungal'
                              ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                          }`}
                        >
                          {pest.type}
                        </span>
                      </div>

                      <div className="space-y-1 text-emerald-900/90 dark:text-emerald-200/90">
                        <div>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Symptoms:</span>{' '}
                          {pest.symptoms}
                        </div>
                        <div>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Prevention:</span>{' '}
                          {pest.prevention}
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 text-xs">
                          <strong>Organic Solution:</strong> {pest.organicControl}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEASONS & LIFECYCLE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Germination Time
                  </div>
                  <div className="text-base font-bold text-emerald-950 dark:text-white mt-1">
                    {plant.lifecycle.germinationDays}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Days to Harvest / Maturity
                  </div>
                  <div className="text-base font-bold text-emerald-950 dark:text-white mt-1">
                    {plant.lifecycle.harvestDays}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
                  <div className="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Primary Growing Season
                  </div>
                  <div className="text-base font-bold text-emerald-950 dark:text-white mt-1">
                    {plant.lifecycle.season}
                  </div>
                </div>
              </div>

              {/* 4 Seasons Care Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>4-Season Seasonal Management Plan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Spring Routine
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {plant.lifecycle.seasonsCare.spring}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60">
                    <div className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Summer Routine
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {plant.lifecycle.seasonsCare.summer}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/60">
                    <div className="font-bold text-xs text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Autumn / Fall Routine
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {plant.lifecycle.seasonsCare.autumn}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60">
                    <div className="font-bold text-xs text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Winter Routine
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {plant.lifecycle.seasonsCare.winter}
                    </p>
                  </div>
                </div>
              </div>

              {/* Harvesting and Storage */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Harvesting Indicators & Post-Harvest Storage
                </h4>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Signs of Readiness:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-emerald-900 dark:text-emerald-200">
                      {plant.harvesting.signs.map((sign, i) => (
                        <li key={i}>{sign}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Harvesting Method:</span>{' '}
                    <span>{plant.harvesting.method}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200">
                    <strong>Storage Advice:</strong> {plant.harvesting.storageTips}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPANION GUILD */}
          {activeTab === 'companions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/80">
                <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 mb-1">
                  Synergistic Guild & Biodiversity
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  {plant.companionPlants.reason}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Good Companions */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Good Neighbors (Plant Together)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plant.companionPlants.good.map((comp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold text-xs border border-emerald-200 dark:border-emerald-800"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bad Companions */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <span>Bad Neighbors (Keep Apart)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plant.companionPlants.bad.map((bad, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold text-xs border border-rose-200 dark:border-rose-900/50"
                      >
                        {bad}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WATER CALCULATOR & MY GARDEN NOTES */}
          {activeTab === 'tools' && (
            <div className="space-y-6 animate-fade-in">
              {/* Interactive Water Schedule Calculator */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Watering Frequency Estimator</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1.5">
                      Planting Location / Container Type:
                    </label>
                    <select
                      value={calcLocation}
                      onChange={(e) => setCalcLocation(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-medium"
                    >
                      <option value="outdoor_bed">In-ground Garden / Field</option>
                      <option value="raised_planter">Raised Garden Bed</option>
                      <option value="indoor_pot">Indoor Pot / Planter</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1.5">
                      Current Climate / Weather:
                    </label>
                    <select
                      value={calcClimate}
                      onChange={(e) => setCalcClimate(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-medium"
                    >
                      <option value="moderate">Moderate Warm Weather (20°C - 27°C)</option>
                      <option value="hot_dry">Hot & Dry Summer Heatwave (30°C+)</option>
                      <option value="cool_humid">Cool / Humid Monsoon / Winter</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-sky-950 dark:text-sky-200 flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-sky-500 shrink-0" />
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400">
                      Calculated Watering Target
                    </div>
                    <div className="font-bold text-sm mt-0.5">{calcWaterResult}</div>
                  </div>
                </div>
              </div>

              {/* Personal Garden Notes Journal */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>My Garden Notes & Planting Journal</span>
                  </h4>
                  {notesSavedAlert && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      Saved to local storage!
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
                  Record your custom planting dates, fertilizer mixes, bed locations, or harvest yields for this plant.
                </p>

                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Sowed 6 seeds on March 15 in Raised Bed #2. Applied bone meal. First harvest expected June 1."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 placeholder-emerald-800/40 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Garden Notes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASK AI PLANT SPECIALIST */}
          {activeTab === 'ai_ask' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-emerald-900 text-white space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Interactive Gemini Agronomist</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Ask Anything About Caring for {plant.commonName}
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Ask specific questions about soil amendments, leaf yellowing, pruning branches, hydroponics, or pest troubleshooting.
                </p>
              </div>

              {/* Chat question form */}
              <form onSubmit={handleAskSpecialist} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={`Ask a question (e.g. "Why are my ${plant.commonName} leaves drooping?" or "What pesticide should I spray for caterpillars?")...`}
                    disabled={isAiAsking}
                    className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 placeholder-emerald-800/40 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={isAiAsking || !aiQuestion.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isAiAsking ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Ask AI</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Quick question prompts */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Try asking:</span>
                  {[
                    `What pesticide to use if my ${plant.commonName} has leaf blight?`,
                    `How much neem oil to spray for aphids on ${plant.commonName}?`,
                    `How to recover ${plant.commonName} after heavy worm damage?`,
                  ].map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAiQuestion(q)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </form>

              {/* Chat responses history */}
              {aiHistory.length > 0 && (
                <div className="space-y-4">
                  {aiHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-[#18261C] border border-emerald-100 dark:border-emerald-900/60 shadow-xs space-y-2.5"
                    >
                      <div className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase">
                          You
                        </span>
                        <span>{item.q}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed whitespace-pre-line border border-emerald-100 dark:border-emerald-800/60">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Modal Bottom Action Footer */}
        <div className="p-4 bg-emerald-50/90 dark:bg-[#0E1711] border-t border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : 'bg-white dark:bg-[#142017] text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved in My Garden' : 'Add to My Garden'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onStartScan && (
              <button
                onClick={() => {
                  onClose();
                  onStartScan(plant.commonName);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Diagnose Disease with Camera</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-[#142017] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100/50 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
