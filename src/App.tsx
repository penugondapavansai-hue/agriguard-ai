import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { HomePage } from './pages/HomePage';
import { DetectPage } from './pages/DetectPage';
import { PlantCarePage } from './pages/PlantCarePage';
import { HistoryPage } from './pages/HistoryPage';
import { CommunityPage } from './pages/CommunityPage';
import { AboutPage } from './pages/AboutPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  AnalysisResult,
  Language,
  SampleCropData,
  ThemeMode,
} from './types';
import {
  getSavedAnalyses,
  removeAnalysisFromHistory,
  clearAllHistory,
  checkServerHealth,
} from './services/api';
import {
  fetchUserCloudAnalyses,
  syncLocalHistoryToCloud,
} from './services/firebase';
import { SAMPLE_CROPS } from './data/sampleData';

function MainAppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'detect' | 'plant-care' | 'history' | 'community' | 'about'>('home');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('agriguard_theme') as ThemeMode) || 'light';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('agriguard_lang') as Language) || 'en';
  });
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState<SampleCropData | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Initialize history from localStorage
  useEffect(() => {
    setHistory(getSavedAnalyses());
  }, []);

  // Sync with Firestore Cloud when user signs in
  const syncWithCloud = useCallback(async () => {
    if (!user) return;
    setIsSyncingCloud(true);
    try {
      // 1. Push any local records to user's Firestore
      await syncLocalHistoryToCloud(user.uid);

      // 2. Fetch all cloud records for user
      const cloudRecords = await fetchUserCloudAnalyses(user.uid);
      if (cloudRecords && cloudRecords.length > 0) {
        // Merge & deduplicate with local history
        const local = getSavedAnalyses();
        const map = new Map<string, AnalysisResult>();
        local.forEach((item) => map.set(item.id, item));
        cloudRecords.forEach((item) => map.set(item.id, item));

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.analyzedAt || 0).getTime() - new Date(a.analyzedAt || 0).getTime()
        );

        setHistory(merged);
        localStorage.setItem('agriguard_history', JSON.stringify(merged));
      }
    } catch (e) {
      console.warn('Sync with cloud failed:', e);
    } finally {
      setIsSyncingCloud(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      syncWithCloud();
    }
  }, [user, syncWithCloud]);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth().then((health) => {
      setHasGeminiKey(health.hasGeminiKey);
    });
  }, []);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('agriguard_theme', theme);

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync language with localStorage
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('agriguard_lang', lang);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartDetect = (specimen?: SampleCropData) => {
    if (specimen) {
      setSelectedSpecimen(specimen);
    } else {
      setSelectedSpecimen(null);
    }
    setActiveTab('detect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavedToHistory = (newResult: AnalysisResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newResult.id);
      return [newResult, ...filtered];
    });
  };

  const handleDeleteHistoryRecord = (id: string) => {
    const updated = removeAnalysisFromHistory(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F2] dark:bg-[#0E1711] text-[#1A2E1A] dark:text-[#E2ECE1] font-sans transition-colors duration-200 selection:bg-emerald-600 selection:text-white">
      {/* 1. Main Header */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
        language={language}
      />

      {/* 2. Main Tab Viewports */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onStartDetect={handleStartDetect}
            onNavigateToPlantCare={() => {
              setActiveTab('plant-care');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        )}

        {activeTab === 'detect' && (
          <DetectPage
            initialSpecimen={selectedSpecimen}
            onClearInitialSpecimen={() => setSelectedSpecimen(null)}
            language={language}
            onSavedToHistory={handleSavedToHistory}
          />
        )}

        {activeTab === 'plant-care' && (
          <PlantCarePage
            onStartScan={(cropName) => {
              if (cropName) {
                const sampleMatch = SAMPLE_CROPS.find(
                  (s) => s.cropName.toLowerCase() === cropName.toLowerCase()
                );
                if (sampleMatch) {
                  handleStartDetect(sampleMatch);
                  return;
                }
              }
              handleStartDetect();
            }}
            language={language}
          />
        )}

        {activeTab === 'community' && (
          <CommunityPage
            language={language}
            onStartDetect={() => handleStartDetect()}
            recentAnalyses={history}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            onDeleteRecord={handleDeleteHistoryRecord}
            onClearAll={handleClearAllHistory}
            onStartDetect={() => handleStartDetect()}
            onRefreshCloudSync={syncWithCloud}
            isSyncing={isSyncingCloud}
            language={language}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            language={language}
            onStartDetect={() => handleStartDetect()}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={language}
      />

      {/* 4. Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        historyCount={history.length}
        onClearHistory={handleClearAllHistory}
        hasGeminiKey={hasGeminiKey}
      />

      <AuthModal />
      <ProfileModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

