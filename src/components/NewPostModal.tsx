import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Sprout,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnalysisResult, ForumIssueCategory, ForumUrgency } from '../types';
import { createForumPost } from '../services/firebase';
import { CameraModal } from './CameraModal';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
  recentAnalyses?: AnalysisResult[];
}

export const CROPS_LIST = [
  'Tomato',
  'Cotton',
  'Paddy / Rice',
  'Chili',
  'Wheat',
  'Maize / Corn',
  'Potato',
  'Onion',
  'Soybean',
  'Sugarcane',
  'Mango',
  'Citrus',
  'Banana',
  'Groundnut',
  'Mustard',
  'Other Crop',
];

export const CATEGORIES_LIST: { id: ForumIssueCategory; label: string; desc: string }[] = [
  { id: 'pest', label: 'Pest / Insect Attack', desc: 'Thrips, Whitefly, Borers, Caterpillars' },
  { id: 'fungal', label: 'Fungal Infection', desc: 'Blight, Rust, Powdery Mildew, Anthracnose' },
  { id: 'bacterial', label: 'Bacterial Disease', desc: 'Bacterial wilt, Leaf spot, Canker' },
  { id: 'viral', label: 'Viral Syndrome', desc: 'Leaf curl virus, Mosaic virus' },
  { id: 'deficiency', label: 'Nutrient Deficiency', desc: 'Nitrogen, Zinc, Iron, Magnesium chlorosis' },
  { id: 'weather', label: 'Soil / Weather Stress', desc: 'Drought, Waterlogging, Heat scorch, Salinity' },
  { id: 'general', label: 'General Crop Advisory', desc: 'Pruning, Sowing, Organic IPM practice' },
];

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  recentAnalyses = [],
}) => {
  const { user, openAuthModal } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [crop, setCrop] = useState(CROPS_LIST[0]);
  const [category, setCategory] = useState<ForumIssueCategory>('pest');
  const [urgency, setUrgency] = useState<ForumUrgency>('medium');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    setIsCameraOpen(false);
  };

  const handleAttachAnalysis = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
    if (analysis.imageThumbnail && !imagePreview) {
      setImagePreview(analysis.imageThumbnail);
    }
    if (analysis.crop && CROPS_LIST.includes(analysis.crop)) {
      setCrop(analysis.crop);
    }
    setTitle((prev) => prev || `Identified ${analysis.problem} on ${analysis.crop} - Need Treatment Advice`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please provide a descriptive title and symptom details.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createForumPost({
        userId: user.uid,
        authorName: user.displayName || 'Field Grower',
        authorEmail: user.email,
        authorAvatar: user.photoURL,
        authorRole: user.role || 'farmer',
        authorLocation: user.location,
        title: title.trim(),
        description: description.trim(),
        crop,
        category,
        urgency,
        imageUrl: imagePreview || undefined,
        analysisSnippet: selectedAnalysis
          ? {
              problem: selectedAnalysis.problem,
              confidence: selectedAnalysis.confidence,
              severity: selectedAnalysis.severity,
              recommendationSummary: selectedAnalysis.recommendations?.[0] || 'See AI diagnostics',
            }
          : undefined,
        status: 'open',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setImagePreview(null);
      setSelectedAnalysis(null);

      if (onPostCreated) onPostCreated();
      onClose();
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        id="new-post-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      >
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Ask Community & Agronomists</span>
            </div>
            <h2 className="text-2xl font-bold text-emerald-950 dark:text-white tracking-tight">
              Post Crop Issue / Field Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70">
              Share clear leaf or pest images, specify symptoms, and get verified advice from experienced growers and agronomists.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Attach AI Diagnosis from History */}
            {recentAnalyses.length > 0 && (
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attach Recent Vision AI Diagnosis</span>
                  </span>
                  {selectedAnalysis && (
                    <button
                      type="button"
                      onClick={() => setSelectedAnalysis(null)}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {recentAnalyses.slice(0, 3).map((analysis) => (
                    <button
                      key={analysis.id}
                      type="button"
                      onClick={() => handleAttachAnalysis(analysis)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all shrink-0 w-48 cursor-pointer ${
                        selectedAnalysis?.id === analysis.id
                          ? 'border-emerald-600 bg-emerald-100/80 dark:bg-emerald-900/80 text-emerald-950 dark:text-white font-bold ring-2 ring-emerald-500/20'
                          : 'border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-[#1f3124] text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="truncate font-bold">{analysis.crop}</div>
                      <div className="text-[11px] truncate opacity-80">{analysis.problem}</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                        {analysis.confidence}% confidence
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Question Title / Main Symptom *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Yellow concentric rings on tomato foliage after heavy rains"
                className="w-full px-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Crop & Category & Urgency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Crop Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Crop Type *
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {CROPS_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ForumIssueCategory)}
                  className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Outbreak Urgency *
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as ForumUrgency)}
                  className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="low">Low (Routine Check)</option>
                  <option value="medium">Medium (Spreading)</option>
                  <option value="high">High (Severe Outbreak)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Detailed Field Symptoms & Context *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe: When did the symptoms start? What percentage of the field is affected? Any previous fertilizer or pesticide sprays applied recently?"
                className="w-full px-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
              />
            </div>

            {/* Image Attachment Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                <span>Attach Specimen Photo</span>
                <span className="font-normal text-[11px] text-emerald-700/60">Optional but recommended</span>
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 max-h-56 bg-black/10">
                  <img
                    src={imagePreview}
                    alt="Specimen preview"
                    className="w-full h-56 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-3 right-3 p-1.5 bg-rose-600 text-white rounded-full shadow-md cursor-pointer hover:bg-rose-700"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="p-4 rounded-2xl border-2 border-dashed border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Upload from Device
                    </span>
                    <span className="text-[10px] text-emerald-800/60 dark:text-emerald-400/50">
                      JPG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="p-4 rounded-2xl border-2 border-dashed border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Open Camera
                    </span>
                    <span className="text-[10px] text-emerald-800/60 dark:text-emerald-400/50">
                      Take live field photo
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </span>
                ) : (
                  <>
                    <Sprout className="w-4 h-4" />
                    <span>Publish to Community</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
};
