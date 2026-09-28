import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  X,
  ScanLine,
  ArrowUpDown,
  Sparkles,
  Sprout,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { HistoryCard } from '../components/HistoryCard';
import { DashboardStats } from '../components/DashboardStats';
import { ResultDashboard } from '../components/ResultDashboard';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { AnalysisResult, Language } from '../types';
import { t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface HistoryPageProps {
  history: AnalysisResult[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onStartDetect: () => void;
  onRefreshCloudSync?: () => void;
  isSyncing?: boolean;
  language?: Language;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onDeleteRecord,
  onClearAll,
  onStartDetect,
  onRefreshCloudSync,
  isSyncing = false,
  language = 'en',
}) => {
  const { user, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence'>('newest');
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return history
      .filter((item) => {
        const matchesSearch =
          item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.visualSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedSeverity === 'ALL') return true;
        if (selectedSeverity === 'DEMO') return item.isDemo === true;
        return item.severity === selectedSeverity;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.analyzedAt || 0).getTime() - new Date(a.analyzedAt || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.analyzedAt || 0).getTime() - new Date(b.analyzedAt || 0).getTime();
        }
        if (sortBy === 'confidence') {
          return (b.confidence || 0) - (a.confidence || 0);
        }
        return 0;
      });
  }, [history, searchQuery, selectedSeverity, sortBy]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecordToDelete(id);
  };

  return (
    <div id="history-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Logs</span>
            </span>
            {user ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>Synced with {user.displayName || 'Account'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <span>Local Session Only</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-white tracking-tight">
            {t('analysisHistory', language)}
          </h1>
          <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 mt-1">
            {user
              ? 'Tied to your AgriGuard account with automatic cross-device cloud synchronization.'
              : 'Stored in this browser. Log in to synchronize your crop diagnoses across your mobile and PC.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {user && onRefreshCloudSync && (
            <button
              onClick={onRefreshCloudSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 font-bold rounded-xl text-xs border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Sync Cloud Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
          )}

          {!user && (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 font-bold rounded-xl text-xs border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>Log in to Sync</span>
            </button>
          )}

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold rounded-xl text-xs border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearHistory', language)}</span>
            </button>
          )}

          <button
            onClick={onStartDetect}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Announcement if not logged in */}
      {!user && (
        <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 dark:text-white">
                Enable Cross-Device Synchronized History
              </h4>
              <p className="text-emerald-800/70 dark:text-emerald-300/70 text-[11px]">
                Create a free grower account to preserve your field diagnostics in Firestore and access them anytime anywhere.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            Create Account & Sync
          </button>
        </div>
      )}

      {/* Dashboard Analytics Bar */}
      <DashboardStats history={history} />


      {/* Search, Filter & Sort Controls */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, pest, or symptom..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Severity Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {['ALL', 'LOW', 'MODERATE', 'HIGH', 'DEMO'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSeverity === sev
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="confidence">Highest Confidence</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* History Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onSelect={(record) => setSelectedItem(record)}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : history.length > 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 space-y-3">
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            No matching records found for "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSeverity('ALL');
            }}
            className="text-xs text-emerald-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            {t('noHistory', language)}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {t('noHistoryDesc', language)}
          </p>
          <button
            onClick={onStartDetect}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            <span>Analyze Your First Crop</span>
          </button>
        </div>
      )}

      {/* Selected Item Full View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-stone-50 dark:bg-stone-950 rounded-3xl p-4 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 rounded-full shadow-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <ResultDashboard
              result={selectedItem}
              imageSrc={selectedItem.imageThumbnail || ''}
              onSave={() => {}}
              isSaved={true}
              onReset={() => setSelectedItem(null)}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Single Item Deletion Confirm */}
      <ConfirmationDialog
        isOpen={Boolean(recordToDelete)}
        title="Delete Crop Record?"
        message="Are you sure you want to remove this diagnosis record from your local history?"
        confirmLabel="Delete Record"
        onConfirm={() => {
          if (recordToDelete) {
            onDeleteRecord(recordToDelete);
            setRecordToDelete(null);
          }
        }}
        onCancel={() => setRecordToDelete(null)}
        isDestructive={true}
      />

      {/* Clear All Confirmation */}
      <ConfirmationDialog
        isOpen={showClearConfirm}
        title="Clear All History?"
        message="This will permanently delete all saved crop analysis records and thumbnails from this browser. This cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={() => {
          onClearAll();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
        isDestructive={true}
      />
    </div>
  );
};
