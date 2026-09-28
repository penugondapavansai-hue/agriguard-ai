import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  ShieldCheck,
} from 'lucide-react';
import { ImageQualityReport, Language } from '../types';
import { t } from '../utils/translations';

interface ImagePreviewProps {
  imageSrc: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  qualityReport: ImageQualityReport | null;
  isAnalyzing: boolean;
  onAnalyze: (userNotes?: string) => void;
  onReset: () => void;
  language?: Language;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  fileName,
  fileSize,
  fileType,
  qualityReport,
  isAnalyzing,
  onAnalyze,
  onReset,
  language = 'en',
}) => {
  const [showQualityDetails, setShowQualityDetails] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);

  const hasWarnings = qualityReport && qualityReport.warnings.length > 0;

  return (
    <div id="crop-image-preview-panel" className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Visual Preview Area */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 shadow-inner group">
              <img
                src={imageSrc}
                alt="Selected crop specimen"
                className="w-full h-full object-contain"
              />

              {/* Quality overlay tag */}
              <div className="absolute top-3 left-3">
                {hasWarnings ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-bold shadow-md backdrop-blur-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Quality Notice
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-md backdrop-blur-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Ready for Vision AI
                  </span>
                )}
              </div>
            </div>

            {/* Image Metadata Strip */}
            <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-emerald-700/80 dark:text-emerald-400/70">
              <div className="flex items-center gap-2 truncate max-w-xs">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-950 dark:text-emerald-200 truncate">
                  {fileName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {fileSize && <span>{fileSize}</span>}
                {fileType && <span className="uppercase">{fileType.replace('image/', '')}</span>}
              </div>
            </div>
          </div>

          {/* Quality Assessment & Controls Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-emerald-950 dark:text-white tracking-tight">
                  {t('imagePreview', language)}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-100 dark:border-emerald-900/60">
                  Step 2 of 3
                </span>
              </div>

              {/* Quality Check Section */}
              {hasWarnings ? (
                <div
                  id="image-quality-warning-box"
                  className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 text-amber-900 dark:text-amber-200 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">
                        {t('warningQualityTitle', language)}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                        Visual factors like low lighting or blur may reduce AI confidence, but you can still proceed.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQualityDetails(!showQualityDetails)}
                    className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{showQualityDetails ? 'Hide tips' : 'View photography tips'}</span>
                    {showQualityDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showQualityDetails && (
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 text-xs space-y-1.5 animate-fade-in">
                      <div className="font-semibold text-stone-800 dark:text-stone-200">
                        Suggestions for best diagnostic accuracy:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-300 pl-1">
                        {qualityReport.suggestions.map((sug, idx) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 p-4 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950 dark:text-white">Clear Specimen Quality</h4>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70 mt-0.5">
                      Good lighting and resolution detected. Ready for Gemini multimodal vision analysis.
                    </p>
                  </div>
                </div>
              )}

              {/* Optional Crop Context Note */}
              <div className="pt-1">
                {!showNotesField ? (
                  <button
                    type="button"
                    onClick={() => setShowNotesField(true)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300/80 dark:hover:text-emerald-200 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Add optional field observation or note (e.g. crop age, field location)</span>
                  </button>
                ) : (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 flex items-center justify-between">
                      <span>Field Observation Note (Optional):</span>
                      <button
                        type="button"
                        onClick={() => setShowNotesField(false)}
                        className="text-[11px] text-emerald-600 hover:text-emerald-800"
                      >
                        Cancel
                      </button>
                    </label>
                    <textarea
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="e.g. Tomato crop 45 days old, lower leaves curling since yesterday..."
                      rows={2}
                      className="w-full text-xs p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#111c13] text-[#1A2E1A] dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Action Buttons */}
            <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="start-crop-analysis-btn"
                type="button"
                disabled={isAnalyzing}
                onClick={() => onAnalyze(userNotes)}
                className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('analyzeButton', language)}</span>
              </button>

              <button
                id="choose-another-image-btn"
                type="button"
                disabled={isAnalyzing}
                onClick={onReset}
                className="w-full sm:w-auto py-3.5 px-5 bg-white dark:bg-[#142017] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold rounded-xl text-sm border border-emerald-200 dark:border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('chooseAnother', language)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
