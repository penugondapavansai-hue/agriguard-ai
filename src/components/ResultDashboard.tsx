import React, { useState } from 'react';
import {
  Leaf,
  Bug,
  AlertTriangle,
  CheckCircle,
  Shield,
  Eye,
  UserCheck,
  Bookmark,
  Share2,
  RotateCcw,
  Sparkles,
  Printer,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  Sprout,
  HeartHandshake,
  HelpCircle,
  FileDown,
  Loader2,
  Download,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisResult, Language } from '../types';
import { ConfidenceMeter } from './ConfidenceMeter';
import { SeverityBadge } from './SeverityBadge';
import { Disclaimer } from './Disclaimer';
import { t } from '../utils/translations';
import { generateCropReportPdf } from '../utils/pdfGenerator';

interface ResultDashboardProps {
  result: AnalysisResult;
  imageSrc: string;
  onSave: (result: AnalysisResult) => void;
  isSaved: boolean;
  onReset: () => void;
  language?: Language;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  imageSrc,
  onSave,
  isSaved,
  onReset,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(isSaved);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSave = () => {
    onSave(result);
    setSaveSuccess(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch (e) {}
  };

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await generateCropReportPdf({
        result,
        imageSrc,
        language,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF document:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShare = async () => {
    const summaryText = `AgriGuard AI Crop Report:\n🌱 Crop: ${result.crop}\n🐛 Problem: ${result.problem}\n📊 Confidence: ${result.confidence}% (${result.confidenceLevel})\n⚠️ Severity: ${result.severity}\n\n🔍 Observed Symptoms:\n${result.visualSymptoms.map((s) => `• ${s}`).join('\n')}\n\n💡 Recommendations:\n${result.recommendations.map((r) => `• ${r}`).join('\n')}\n\nAgriGuard AI – Identify. Understand. Protect.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `AgriGuard AI Analysis – ${result.crop}`,
          text: summaryText,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(result.analyzedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id="ai-crop-analysis-dashboard" className="space-y-8 animate-fade-in print:space-y-4">
      {/* Top Banner & Quick Action Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm print:border-none print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                {t('resultsTitle', language)}
              </span>
              {result.isDemo && (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  {t('demoResultBadge', language)}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              {result.crop}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              Analyzed on {formattedDate}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              id="save-analysis-btn"
              type="button"
              onClick={handleSave}
              disabled={saveSuccess}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{saveSuccess ? 'Saved to History' : t('saveAnalysis', language)}</span>
            </button>

            <button
              id="download-pdf-btn"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
              title="Download formatted PDF document for offline reference"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span>
                {isDownloadingPdf
                  ? t('downloadingPdf', language)
                  : downloadSuccess
                  ? t('pdfSuccess', language)
                  : t('downloadPdf', language)}
              </span>
            </button>

            <button
              id="share-analysis-btn"
              type="button"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Report!' : t('shareAnalysis', language)}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors hidden sm:flex cursor-pointer"
              title="Print or Export"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              id="analyze-another-crop-btn"
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('analyzeAnother', language)}</span>
            </button>
          </div>
        </div>

        {/* Primary Diagnosis Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          {/* Specimen Photo Thumbnail with overlay */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-md">
              <img
                src={imageSrc}
                alt={result.crop}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 border border-stone-700">
                <Sprout className="w-3 h-3 text-emerald-400" />
                <span>Observed Specimen</span>
              </div>
            </div>
          </div>

          {/* Core Problem & Severity Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {t('possibleProblem', language)}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mt-1 text-emerald-950 dark:text-emerald-100">
                {result.problem}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>AI-assisted model inference based on visible symptoms. Not a laboratory guarantee.</span>
              </p>
            </div>

            {/* Metrics Row: Confidence & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t('confidenceScore', language)}
                </span>
                <div className="pt-1">
                  <ConfidenceMeter
                    confidence={result.confidence}
                    level={result.confidenceLevel}
                    size="md"
                  />
                </div>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t('severityBadge', language)}
                </span>
                <div className="pt-1">
                  <SeverityBadge severity={result.severity} showDescription />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Detailed Analytical Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* A & B. Observed Symptoms ("What the AI noticed") */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                {t('observedSymptoms', language)}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t('whatAiNoticed', language)}
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-2">
            {result.visualSymptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* F. Recommended Next Steps (Immediate Safe Actions) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                {t('recommendedSteps', language)}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Immediate cultural & field practices
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-2">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* G. Integrated Pest Management (IPM) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                {t('ipmHeading', language)}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Biological, physical & botanical options
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-2">
            {result.ipm.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* H. Prevention & Field Sanitation */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                {t('preventionHeading', language)}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Long-term crop hygiene & barrier protection
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-2">
            {result.prevention.map((prev, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-2" />
                <span className="leading-snug">{prev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* I. Monitoring & Scouting Advice */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                {t('monitoringHeading', language)}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Field scouting intervals & threshold tracking
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-2">
            {result.monitoring.map((mon, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                <span className="leading-snug">{mon}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* J. When to Consult an Expert */}
        <div className="bg-white dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950/80 rounded-3xl p-6 shadow-sm space-y-4 bg-rose-50/30 dark:bg-rose-950/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-rose-900 dark:text-rose-200">
                {t('expertConsultHeading', language)}
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Escalation triggers & extension advisory
              </p>
            </div>
          </div>

          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-2">
            {result.expertAdvice}
          </p>

          <div className="pt-2">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-rose-200 dark:border-rose-900/60 text-xs text-stone-600 dark:text-stone-400 space-y-1">
              <span className="font-bold text-rose-800 dark:text-rose-300 block">
                Recommended Local Resources:
              </span>
              <p>
                Contact your nearest Krishi Vigyan Kendra (KVK), State University Agriculture Clinic, or District Horticulture Extension Officer for laboratory leaf assays.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Reference & Field PDF Export Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-800/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Offline Field Reference</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold">
            Need this diagnostic report offline in the field?
          </h4>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Download a formatted PDF document containing the specimen image, observed symptoms, IPM solutions, and agronomic recommendations to share with your local agrochemical dealer or farm workers without needing internet access.
          </p>
        </div>

        <button
          id="offline-download-pdf-btn"
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloadingPdf}
          className="relative z-10 px-5 py-3 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isDownloadingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
          ) : downloadSuccess ? (
            <Check className="w-4 h-4 text-emerald-950" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>
            {isDownloadingPdf
              ? t('downloadingPdf', language)
              : downloadSuccess
              ? t('pdfSuccess', language)
              : 'Download Field Report (PDF)'}
          </span>
        </button>
      </div>

      {/* Safety Notice Footer */}
      <Disclaimer language={language} />
    </div>
  );
};
