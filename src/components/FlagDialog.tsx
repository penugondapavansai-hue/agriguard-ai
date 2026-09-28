import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';

interface FlagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  targetType: 'post' | 'comment';
}

const COMMON_REASONS = [
  'Potentially hazardous or off-label pesticide dosage',
  'Misleading or unverified agricultural advice',
  'Commercial spam or advertising link',
  'Inappropriate or offensive language',
  'Incorrect specimen image / unrelated content',
];

export const FlagDialog: React.FC<FlagDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetType,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() || selectedReason;
    onSubmit(finalReason);
    onClose();
  };

  return (
    <div
      id="flag-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-emerald-950 dark:text-white">
              Report & Flag {targetType === 'post' ? 'Post' : 'Comment'}
            </h3>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 mt-0.5">
              Help keep our agronomy community safe, science-backed, and friendly for all farmers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Select Violation Reason
            </label>
            <div className="space-y-1">
              {COMMON_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-white font-medium'
                      : 'border-emerald-100 dark:border-emerald-900/40 text-emerald-800/80 dark:text-emerald-300/80 hover:bg-emerald-50/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="flagReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Provide specific notes for community moderators..."
              className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
