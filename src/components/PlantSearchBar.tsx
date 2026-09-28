import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  Leaf,
  Sun,
  Droplets,
  ArrowRight,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { PlantCareProfile, PlantCategory } from '../types';
import { PLANT_CARE_DATABASE } from '../data/plantCareData';

interface PlantSearchBarProps {
  onSelectPlant: (plant: PlantCareProfile) => void;
  onRequestAiPlantCare: (query: string) => void;
  selectedCategory?: PlantCategory;
  onCategoryChange?: (category: PlantCategory) => void;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
}

const POPULAR_QUICK_TAGS = [
  'Tomato',
  'Rice',
  'Monstera',
  'Chili Pepper',
  'Sweet Basil',
  'Corn',
  'Strawberry',
  'Cotton',
  'Wheat',
  'Aloe Vera',
  'Rose',
  'Cucumber',
  'Potato',
  'Lavender',
  'Mango',
  'Snake Plant',
];

const CATEGORIES: { id: PlantCategory; label: string }[] = [
  { id: 'all', label: 'All Plants' },
  { id: 'vegetable', label: 'Vegetables' },
  { id: 'grain', label: 'Grains & Crops' },
  { id: 'fruit', label: 'Fruits' },
  { id: 'herb', label: 'Herbs' },
  { id: 'houseplant', label: 'Houseplants' },
  { id: 'cash_crop', label: 'Cash Crops' },
  { id: 'flower', label: 'Flowers' },
];

export const PlantSearchBar: React.FC<PlantSearchBarProps> = ({
  onSelectPlant,
  onRequestAiPlantCare,
  selectedCategory = 'all',
  onCategoryChange,
  className = '',
  autoFocus = false,
  placeholder = 'Search any plant, crop, vegetable, herb, or flower (e.g. Tomato, Rice, Monstera, Basil)...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter existing local database based on search term
  const searchResults = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];

    return PLANT_CARE_DATABASE.filter((plant) => {
      const matchName = plant.commonName.toLowerCase().includes(term);
      const matchSci = plant.scientificName.toLowerCase().includes(term);
      const matchFamily = plant.family.toLowerCase().includes(term);
      const matchDesc = plant.shortDescription.toLowerCase().includes(term);
      const matchPests = plant.pestsAndDiseases.some(
        (p) => p.name.toLowerCase().includes(term) || p.symptoms.toLowerCase().includes(term)
      );

      return matchName || matchSci || matchFamily || matchDesc || matchPests;
    });
  }, [searchTerm]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      } else if (searchTerm.trim()) {
        // If there's an exact match in local DB
        const exact = PLANT_CARE_DATABASE.find(
          (p) => p.commonName.toLowerCase() === searchTerm.trim().toLowerCase()
        );
        if (exact) {
          handleSelect(exact);
        } else if (searchResults.length > 0) {
          handleSelect(searchResults[0]);
        } else {
          // Request AI generation for this query
          setIsOpen(false);
          onRequestAiPlantCare(searchTerm.trim());
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (plant: PlantCareProfile) => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelectPlant(plant);
  };

  const handleTagClick = (tag: string) => {
    const found = PLANT_CARE_DATABASE.find(
      (p) => p.commonName.toLowerCase().includes(tag.toLowerCase())
    );
    if (found) {
      onSelectPlant(found);
    } else {
      onRequestAiPlantCare(tag);
    }
  };

  const handleAskAiForCustom = () => {
    if (!searchTerm.trim()) return;
    const query = searchTerm.trim();
    setIsOpen(false);
    onRequestAiPlantCare(query);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* 1. Main Search Bar Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-emerald-600 dark:text-emerald-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          id="plant-search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (searchTerm.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-[#142017] text-emerald-950 dark:text-emerald-50 placeholder-emerald-800/40 dark:placeholder-emerald-400/40 border-2 border-emerald-200/80 dark:border-emerald-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm sm:text-base font-medium shadow-lg shadow-emerald-900/5 transition-all outline-hidden"
        />

        {/* Right action controls */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-xl transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (searchTerm.trim()) {
                if (searchResults.length > 0) {
                  handleSelect(searchResults[0]);
                } else {
                  handleAskAiForCustom();
                }
              } else {
                inputRef.current?.focus();
              }
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Auto-Complete Dropdown Menu */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div
          id="plant-search-autocomplete-dropdown"
          className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-[#142017] rounded-2xl border border-emerald-100 dark:border-emerald-800/80 shadow-2xl overflow-hidden divide-y divide-emerald-50 dark:divide-emerald-900/40 animate-fade-in"
        >
          {/* Header result count */}
          <div className="px-4 py-2 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
            <span>
              {searchResults.length > 0
                ? `${searchResults.length} Botanical Profile${searchResults.length > 1 ? 's' : ''} Found`
                : 'No offline match found'}
            </span>
            <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60">
              Press Enter or Click to view Care Guide
            </span>
          </div>

          {/* Results list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-emerald-50 dark:divide-emerald-900/30">
            {searchResults.map((plant, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={plant.id}
                  onClick={() => handleSelect(plant)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-950 dark:text-white'
                      : 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={plant.image}
                      alt={plant.commonName}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-100 dark:border-emerald-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100 truncate">
                          {plant.commonName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {plant.category}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-600/80 dark:text-emerald-400/70 italic truncate">
                        {plant.scientificName} &bull; {plant.family}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    <div className="flex items-center gap-1" title={plant.sunlight.level}>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>{plant.sunlight.level}</span>
                    </div>
                    <div className="flex items-center gap-1" title={plant.watering.frequency}>
                      <Droplets className="w-3.5 h-3.5 text-sky-500" />
                      <span>{plant.watering.moistureLevel} Water</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Generation Trigger Strip */}
          <div
            onClick={handleAskAiForCustom}
            className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-3 cursor-pointer hover:bg-emerald-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">
                  Generate Complete AI Botanical Dossier for &quot;{searchTerm}&quot;
                </div>
                <div className="text-[11px] text-emerald-200/80">
                  Instant Gemini AI analysis of sunlight, watering, soil pH, seasonal care, and pests
                </div>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg text-xs shrink-0 transition-all">
              Generate Now
            </button>
          </div>
        </div>
      )}

      {/* 3. Category Filter Buttons & Quick Suggestions Strip */}
      <div className="mt-3 space-y-2.5">
        {/* Category Pills (if category change handler provided) */}
        {onCategoryChange && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-[#142017]/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Popular Trending Crop Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold mr-1 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Popular:</span>
          </div>
          {POPULAR_QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/60 font-medium whitespace-nowrap transition-all cursor-pointer hover:scale-105"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
