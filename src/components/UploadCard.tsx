import React, { useRef, useState } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, CheckCircle2, Leaf } from 'lucide-react';
import { SAMPLE_CROPS } from '../data/sampleData';
import { SampleCropData, Language } from '../types';
import { t } from '../utils/translations';

interface UploadCardProps {
  onImageSelected: (fileOrDataUrl: File | string, fileName?: string, sampleSpecimen?: SampleCropData) => void;
  onOpenLiveCamera: () => void;
  language?: Language;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onImageSelected,
  onOpenLiveCamera,
  language = 'en',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file, file.name);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageSelected(file, file.name);
    }
  };

  const handleSelectSample = (sample: SampleCropData) => {
    onImageSelected(sample.sampleImage, `${sample.cropName} Specimen.png`, sample);
  };

  return (
    <div id="crop-upload-container" className="space-y-8">
      {/* Main Upload Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center bg-white dark:bg-[#142017] shadow-sm ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 scale-[1.01] ring-4 ring-emerald-500/20'
            : 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 dark:hover:border-emerald-500/70 hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          id="crop-image-file-input"
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Animated Icon Circle */}
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-10 h-10" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Upload className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white tracking-tight mb-2">
            {t('dropImageTitle', language)}
          </h3>

          <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70 mb-6 max-w-sm">
            Upload a clear photo of an affected leaf, stem, fruit, or pest to generate an instant diagnosis.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              id="choose-image-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t('chooseImage', language)}</span>
            </button>

            <button
              id="take-photo-btn"
              type="button"
              onClick={onOpenLiveCamera}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-semibold rounded-xl text-sm border border-emerald-200 dark:border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('takePhoto', language)}</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-emerald-700/70 dark:text-emerald-400/60 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('supportedFormats', language)}</span>
          </div>
        </div>
      </div>

      {/* Sample Specs / Verified Demo Specimen Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-900 dark:text-emerald-300">
              {t('trySampleCrop', language)}
            </h4>
          </div>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-400/60 hidden sm:inline">
            Click any specimen to run visual analysis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_CROPS.map((sample) => (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              onClick={() => handleSelectSample(sample)}
              className="group text-left p-3 rounded-2xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 hover:border-emerald-500 dark:hover:border-emerald-500/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <img
                  src={sample.sampleImage}
                  alt={sample.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                  Specimen
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-xs text-emerald-950 dark:text-white truncate">
                    {sample.cropName}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70 truncate mt-0.5">
                  {sample.problemName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
