import React from 'react';
import { Activity, Award, BarChart3, Clock, Sparkles, Sprout, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types';

interface DashboardStatsProps {
  history: AnalysisResult[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-8 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <Sprout className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-base text-emerald-950 dark:text-emerald-100">
          Activity Dashboard
        </h4>
        <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 max-w-sm mx-auto">
          Start analyzing crops to see your activity here.
        </p>
      </div>
    );
  }

  // Calculate real metrics
  const totalAnalyses = history.length;
  const avgConfidence = Math.round(
    history.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / totalAnalyses
  );

  // Crop count breakdown
  const cropCounts: Record<string, number> = {};
  history.forEach((h) => {
    const rawCrop = h.crop.split('(')[0].trim() || 'Unknown';
    cropCounts[rawCrop] = (cropCounts[rawCrop] || 0) + 1;
  });

  const mostAnalyzedCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Severity counts
  const severityCounts = {
    LOW: history.filter((h) => h.severity === 'LOW').length,
    MODERATE: history.filter((h) => h.severity === 'MODERATE').length,
    HIGH: history.filter((h) => h.severity === 'HIGH').length,
  };

  return (
    <div id="dashboard-statistics-overview" className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Total Scans
              </span>
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-white tracking-tight">
              {totalAnalyses}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60">Local session</span>
            <div className="w-12 h-1 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Avg Confidence
              </span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-white tracking-tight">
              {avgConfidence}%
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60">Visual certainty</span>
            <div className="w-12 h-1 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div style={{ width: `${avgConfidence}%` }} className="bg-emerald-500 h-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Top Crop
              </span>
              <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white tracking-tight truncate">
              {mostAnalyzedCrop}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60">Most analyzed</span>
            <div className="w-12 h-1 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-3/4 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                High Severity
              </span>
              <TrendingUp className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-white tracking-tight">
              {severityCounts.HIGH}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60">Urgent attention</span>
            <div className="w-12 h-1 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Activity Breakdown */}
      <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-sm text-emerald-950 dark:text-white">
              Crop & Severity Distribution
            </h4>
          </div>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-400/60">
            {totalAnalyses} records logged
          </span>
        </div>

        {/* Severity Progress Segments */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-emerald-50 dark:bg-emerald-950/60 rounded-full overflow-hidden flex gap-1 p-0.5 border border-emerald-100 dark:border-emerald-900/40">
            {severityCounts.LOW > 0 && (
              <div
                style={{ width: `${(severityCounts.LOW / totalAnalyses) * 100}%` }}
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                title={`Low Severity: ${severityCounts.LOW}`}
              />
            )}
            {severityCounts.MODERATE > 0 && (
              <div
                style={{ width: `${(severityCounts.MODERATE / totalAnalyses) * 100}%` }}
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                title={`Moderate Severity: ${severityCounts.MODERATE}`}
              />
            )}
            {severityCounts.HIGH > 0 && (
              <div
                style={{ width: `${(severityCounts.HIGH / totalAnalyses) * 100}%` }}
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                title={`High Severity: ${severityCounts.HIGH}`}
              />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-800/80 dark:text-emerald-300/80 px-1 pt-1 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Low ({severityCounts.LOW})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Moderate ({severityCounts.MODERATE})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>High ({severityCounts.HIGH})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
