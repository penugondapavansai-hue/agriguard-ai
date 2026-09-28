import React from 'react';
import { Hero } from '../components/Hero';
import { SeasonalPlantingTips } from '../components/SeasonalPlantingTips';
import { HomePlantCareSection } from '../components/HomePlantCareSection';
import { FeaturesSection } from '../components/FeatureCard';
import { HowItWorks } from '../components/HowItWorks';
import { PrivacySection } from '../components/PrivacySection';
import { Disclaimer } from '../components/Disclaimer';
import { SAMPLE_CROPS } from '../data/sampleData';
import { SampleCropData, Language } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Sprout, Scan } from 'lucide-react';
import { t } from '../utils/translations';

interface HomePageProps {
  onStartDetect: (sampleSpecimen?: SampleCropData) => void;
  onNavigateToPlantCare?: () => void;
  language?: Language;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartDetect,
  onNavigateToPlantCare,
  language = 'en',
}) => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home-page-view" className="space-y-4 animate-fade-in">
      {/* 1. Hero Section */}
      <Hero
        onStartDetect={() => onStartDetect()}
        onScrollToHowItWorks={scrollToHowItWorks}
        language={language}
      />

      {/* 2. Plant Care Search & Showcase Section */}
      <HomePlantCareSection
        onNavigateToPlantCare={onNavigateToPlantCare || (() => {})}
        onStartDetect={(crop) => {
          if (crop) {
            const match = SAMPLE_CROPS.find(
              (s) => s.cropName.toLowerCase() === crop.toLowerCase()
            );
            if (match) {
              onStartDetect(match);
              return;
            }
          }
          onStartDetect();
        }}
        language={language}
      />

      {/* 3. Dynamic Seasonal Planting Tips & Pest Control Guide */}
      <SeasonalPlantingTips
        onStartDetect={onStartDetect}
        language={language}
      />

      {/* 3. Interactive Specimen Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-800 rounded-full opacity-50 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-60 h-60 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Field Specimen Tests</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Explore Common Crop Pests & Diseases
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl mt-1">
                Test the Gemini Vision diagnostic pipeline instantly with verified field specimens across major food and commercial crops.
              </p>
            </div>

            <button
              onClick={() => onStartDetect()}
              className="self-start md:self-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Upload Custom Photo</span>
            </button>
          </div>

          {/* Sample specimens grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SAMPLE_CROPS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onStartDetect(sample)}
                className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/10 text-left transition-all hover:scale-[1.03] cursor-pointer"
              >
                <div className="aspect-4/3 rounded-lg overflow-hidden mb-2 bg-emerald-950/80">
                  <img
                    src={sample.sampleImage}
                    alt={sample.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="font-bold text-xs text-white truncate">
                  {sample.cropName}
                </div>
                <div className="text-[11px] text-emerald-300 truncate">
                  {sample.problemName}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <FeaturesSection />

      {/* 4. How It Works Section */}
      <HowItWorks language={language} />

      {/* 5. Privacy Guarantee Strip */}
      <PrivacySection language={language} />

      {/* 6. Agriculture Disclaimer Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Disclaimer language={language} />
      </div>
    </div>
  );
};
