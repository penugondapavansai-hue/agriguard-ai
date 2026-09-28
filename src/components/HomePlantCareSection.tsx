import React, { useState } from 'react';
import {
  Sprout,
  Search,
  ArrowRight,
  Sun,
  Droplets,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { PlantCareProfile, Language } from '../types';
import { PLANT_CARE_DATABASE } from '../data/plantCareData';
import { PlantSearchBar } from './PlantSearchBar';
import { PlantDetailModal } from './PlantDetailModal';
import { fetchAiPlantCare } from '../services/api';

interface HomePlantCareSectionProps {
  onNavigateToPlantCare: () => void;
  onStartDetect: (specimenCrop?: string) => void;
  language?: Language;
}

export const HomePlantCareSection: React.FC<HomePlantCareSectionProps> = ({
  onNavigateToPlantCare,
  onStartDetect,
  language = 'en',
}) => {
  const [activeModalPlant, setActiveModalPlant] = useState<PlantCareProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Feature top 4 popular crops/plants for the home showcase
  const featuredPlants = PLANT_CARE_DATABASE.slice(0, 4);

  const handleSelectPlant = (plant: PlantCareProfile) => {
    setActiveModalPlant(plant);
    setIsModalOpen(true);
  };

  const handleRequestAi = async (query: string) => {
    setIsGenerating(true);
    try {
      const generated = await fetchAiPlantCare(query, language);
      setActiveModalPlant(generated);
      setIsModalOpen(true);
    } catch (err) {
      console.warn('AI plant care generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-[#142017] rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 dark:border-emerald-900/60 shadow-lg space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Plant & Crop Care Encyclopedia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-white tracking-tight">
              Search Any Plant For Complete Care Instructions
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-300/80">
              Find sunlight requirements, watering schedules, optimal soil pH, seasonal tasks, companion plants, and pest solutions for any crop or houseplant.
            </p>
          </div>

          <button
            onClick={onNavigateToPlantCare}
            className="self-start md:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>Explore All 16+ Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="pt-2">
          <PlantSearchBar
            onSelectPlant={handleSelectPlant}
            onRequestAiPlantCare={handleRequestAi}
            placeholder="Search any plant (e.g. Tomato, Rice, Basil, Monstera, Cotton, Rose)..."
          />
        </div>

        {/* 4-Column Bento Featured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {featuredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => handleSelectPlant(plant)}
              className="group bg-emerald-50/50 dark:bg-[#18261C] rounded-2xl border border-emerald-100 dark:border-emerald-900/60 p-3.5 hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-emerald-950">
                  <img
                    src={plant.image}
                    alt={plant.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                    {plant.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    {plant.difficulty}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-emerald-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {plant.commonName}
                </h4>
                <div className="text-xs text-emerald-600/80 dark:text-emerald-400/70 italic truncate">
                  {plant.scientificName}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  <div className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{plant.sunlight.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>{plant.watering.moistureLevel} Water</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800">
                <span>View Full Care Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <PlantDetailModal
        plant={activeModalPlant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartScan={onStartDetect}
        language={language}
      />
    </section>
  );
};
