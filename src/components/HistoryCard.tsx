import React, { useState } from 'react';
import { Trash2, ExternalLink, Calendar, HelpCircle, Leaf, Sparkles, FileDown, Loader2, Check } from 'lucide-react';
import { AnalysisResult } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { generateCropReportPdf } from '../utils/pdfGenerator';

interface HistoryCardProps {
  item: AnalysisResult;
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onSelect, onDelete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formattedDate = new Date(item.analyzedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleQuickPdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      await generateCropReportPdf({
        result: item,
        imageSrc: item.imageThumbnail,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      id={`history-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Thumbnail Preview */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
          {item.imageThumbnail ? (
            <img
              src={item.imageThumbnail}
              alt={item.crop}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
              <Leaf className="w-8 h-8" />
            </div>
          )}
          {item.isDemo && (
            <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-amber-500 text-[9px] font-bold text-white uppercase">
              Demo
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white truncate">
              {item.crop}
            </h4>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              {item.confidence}%
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium truncate max-w-sm sm:max-w-md">
            {item.problem}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="truncate">{item.visualSymptoms?.[0] || 'Visual symptom noted'}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Severity and Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
        <SeverityBadge severity={item.severity} />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickPdf}
            disabled={isDownloading}
            className="p-2 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
            title="Download PDF report for offline reference"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => onDelete(item.id, e)}
            className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            title="Delete this record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="p-2 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors hidden sm:block">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
