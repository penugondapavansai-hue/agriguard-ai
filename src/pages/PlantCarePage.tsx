import React, { useState, useMemo } from 'react';
import {
  Search,
  Sprout,
  Sun,
  Droplets,
  Heart,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Scan,
  Loader2,
  AlertCircle,
  Bookmark,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { PlantCareProfile, PlantCategory, Language } from '../types';
import { PLANT_CARE_DATABASE } from '../data/plantCareData';
import { PlantSearchBar } from '../components/PlantSearchBar';
import { PlantDetailModal } from '../components/PlantDetailModal';
import { fetchAiPlantCare, getFavoritePlantIds, toggleFavoritePlant } from '../services/api';

interface PlantCarePageProps {
  onStartScan?: (cropName: string) => void;
  language?: Language;
}

export const PlantCarePage: React.FC<PlantCarePageProps> = ({
  onStartScan,
  language = 'en',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Moderate' | 'Challenging'>('all');
  const [onlySaved, setOnlySaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected plant for modal view
  const [activePlant, setActivePlant] = useState<PlantCareProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic AI generated plants cache
  const [customAiPlants, setCustomAiPlants] = useState<PlantCareProfile[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenError, setAiGenError] = useState<string | null>(null);

  // Favorites tracking
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoritePlantIds());

  // Merge local database with any AI-generated plants in this session
  const combinedPlants = useMemo(() => {
    return [...customAiPlants, ...PLANT_CARE_DATABASE];
  }, [customAiPlants]);

  // Filtered plant list
  const filteredPlants = useMemo(() => {
    return combinedPlants.filter((plant) => {
      // Category filter
      if (selectedCategory !== 'all' && plant.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && plant.difficulty !== difficultyFilter) {
        return false;
      }

      // Saved favorites filter
      if (onlySaved && !favoriteIds.includes(plant.id)) {
        return false;
      }

      // Text search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = plant.commonName.toLowerCase().includes(q);
        const matchSci = plant.scientificName.toLowerCase().includes(q);
        const matchDesc = plant.shortDescription.toLowerCase().includes(q);
        const matchPests = plant.pestsAndDiseases.some(
          (p) => p.name.toLowerCase().includes(q) || p.symptoms.toLowerCase().includes(q)
        );
        if (!matchName && !matchSci && !matchDesc && !matchPests) return false;
      }

      return true;
    });
  }, [combinedPlants, selectedCategory, difficultyFilter, onlySaved, favoriteIds, searchQuery]);

  const handleOpenPlantModal = (plant: PlantCareProfile) => {
    setActivePlant(plant);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation();
    const updated = toggleFavoritePlant(plantId);
    setFavoriteIds(updated);
  };

  const handleRequestAiPlantCare = async (query: string) => {
    if (!query.trim()) return;
    setIsGeneratingAi(true);
    setAiGenError(null);

    try {
      const generated = await fetchAiPlantCare(query.trim(), language);
      setCustomAiPlants((prev) => [generated, ...prev.filter((p) => p.id !== generated.id)]);
      setActivePlant(generated);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Failed to generate AI plant care:', err);
      setAiGenError(err.message || 'Could not generate care guide. Please try again.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Hero Search Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-[#0A2612] text-white p-6 sm:p-8 md:p-10 border border-emerald-800/80 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Botanical Care & Agronomic Encyclopedia</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How to Grow & Protect <br className="hidden sm:inline" />
            <span className="text-emerald-400">Any Plant or Crop</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl leading-relaxed">
            Search our comprehensive agronomy database or ask Gemini AI for tailored sunlight, watering, soil pH, seasonal routines, companion guilds, and organic pest control.
          </p>

          {/* Search bar inside Hero */}
          <div className="pt-2">
            <PlantSearchBar
              onSelectPlant={handleOpenPlantModal}
              onRequestAiPlantCare={handleRequestAiPlantCare}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Decorative background glow & icon */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* AI Generation Loading / Error Overlay Bar */}
      {isGeneratingAi && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white flex items-center justify-between gap-4 border border-emerald-700 animate-pulse shadow-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-emerald-300 animate-spin" />
            <div>
              <div className="font-bold text-sm">Generating AI Botanical Care Dossier...</div>
              <div className="text-xs text-emerald-200">
                Gemini AI is researching scientific taxonomy, soil chemistry, IPM controls, and seasonal schedules.
              </div>
            </div>
          </div>
        </div>
      )}

      {aiGenError && (
        <div className="p-4 rounded-2xl bg-rose-900/40 border border-rose-500/50 text-rose-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{aiGenError}</span>
          </div>
          <button
            onClick={() => setAiGenError(null)}
            className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Filter Controls & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#142017] p-4 sm:p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="p-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-semibold text-xs"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy (Beginner-friendly)</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging / Expert</option>
            </select>
          </div>

          {/* Saved in My Garden Toggle */}
          <button
            type="button"
            onClick={() => setOnlySaved((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              onlySaved
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current' : ''}`} />
            <span>Saved in My Garden ({favoriteIds.length})</span>
          </button>
        </div>

        {/* Total Results Count */}
        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Showing <strong>{filteredPlants.length}</strong> botanical guides
        </div>
      </div>

      {/* 3. Plant Cards Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
            No plants matched your current filters
          </h3>
          <p className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-300/80 max-w-md mx-auto">
            Try searching for another plant name or use Gemini AI to generate a brand new comprehensive care guide.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDifficultyFilter('all');
                setOnlySaved(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPlants.map((plant) => {
            const isFav = favoriteIds.includes(plant.id);
            return (
              <div
                key={plant.id}
                onClick={() => handleOpenPlantModal(plant)}
                className="group relative bg-white dark:bg-[#142017] rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-xs hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-700 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Plant Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-emerald-950">
                  <img
                    src={plant.image}
                    alt={plant.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category & Difficulty Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-200 border border-white/10">
                      {plant.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        plant.difficulty === 'Easy'
                          ? 'bg-emerald-500/80 text-white'
                          : plant.difficulty === 'Moderate'
                          ? 'bg-amber-500/80 text-white'
                          : 'bg-rose-500/80 text-white'
                      }`}
                    >
                      {plant.difficulty}
                    </span>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, plant.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      isFav
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-black/40 text-white hover:bg-black/60 border-white/20'
                    }`}
                    title={isFav ? 'Remove from Saved' : 'Save to My Garden'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Bottom Image title */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="font-bold text-base sm:text-lg leading-tight drop-shadow-xs">
                      {plant.commonName}
                    </div>
                    <div className="text-xs text-emerald-200/90 italic truncate drop-shadow-xs">
                      {plant.scientificName}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <p className="text-xs text-emerald-950/80 dark:text-emerald-100/80 line-clamp-2 leading-relaxed">
                    {plant.shortDescription}
                  </p>

                  {/* Quick Vital Indicators */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-50 dark:border-emerald-900/40">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{plant.sunlight.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">{plant.watering.moistureLevel} Water</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">pH {plant.soil.phRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                      <Bookmark className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{plant.pestsAndDiseases.length} Pests Tracked</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 flex items-center gap-1">
                      <span>View Care Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    {onStartScan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartScan(plant.commonName);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-lg text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition-all"
                        title="Scan crop with camera for diseases"
                      >
                        <Scan className="w-3 h-3" />
                        <span>Scan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full Plant Detail Modal */}
      <PlantDetailModal
        plant={activePlant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartScan={onStartScan}
        language={language}
      />
    </div>
  );
};
