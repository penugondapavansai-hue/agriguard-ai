import React, { useState, useEffect } from 'react';
import { UploadCard } from '../components/UploadCard';
import { ImagePreview } from '../components/ImagePreview';
import { LoadingScreen } from '../components/LoadingScreen';
import { ResultDashboard } from '../components/ResultDashboard';
import { CameraModal } from '../components/CameraModal';
import { evaluateImageQuality, compressAndConvertToBase64 } from '../utils/imageQuality';
import { analyzeCropImage, saveAnalysisToHistory, testGeminiConnection, GeminiConnectionTestResult } from '../services/api';
import { syncAnalysisToCloud } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_CROPS } from '../data/sampleData';
import {
  AnalysisResult,
  ImageQualityReport,
  SampleCropData,
  Language,
} from '../types';
import {
  AlertCircle,
  RotateCcw,
  Sparkles,
  FlaskConical,
  KeyRound,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { t } from '../utils/translations';

interface DetectPageProps {
  initialSpecimen?: SampleCropData | null;
  onClearInitialSpecimen?: () => void;
  language?: Language;
  onSavedToHistory: (result: AnalysisResult) => void;
}

export const DetectPage: React.FC<DetectPageProps> = ({
  initialSpecimen,
  onClearInitialSpecimen,
  language = 'en',
  onSavedToHistory,
}) => {
  const { user } = useAuth();
  // Step state: 'upload' | 'preview' | 'analyzing' | 'result' | 'error'
  const [step, setStep] = useState<'upload' | 'preview' | 'analyzing' | 'result' | 'error'>('upload');
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');
  const [fileName, setFileName] = useState<string>('Crop_Photo.jpg');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileType, setFileType] = useState<string>('image/jpeg');
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Developer connection test state
  const [testResult, setTestResult] = useState<GeminiConnectionTestResult | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Effect for 429 retry countdown
  useEffect(() => {
    if (retryCountdown === null || retryCountdown <= 0) return;
    const timer = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryCountdown]);

  // If passed an initial sample specimen from Home or carousel, load it immediately
  useEffect(() => {
    if (initialSpecimen) {
      handleSelectSample(initialSpecimen);
      onClearInitialSpecimen?.();
    }
  }, [initialSpecimen]);

  const handleImageSelected = async (
    fileOrDataUrl: File | string,
    name?: string,
    sampleSpecimen?: SampleCropData
  ) => {
    try {
      let dataUrl = '';
      let fName = name || 'Crop_Photo.jpg';
      let fSize = '';
      let fType = 'image/jpeg';

      if (typeof fileOrDataUrl === 'string') {
        dataUrl = fileOrDataUrl;
        fSize = 'Sample Specimen';
        fType = 'image/png';
      } else {
        const file = fileOrDataUrl;
        fName = file.name;
        fSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        fType = file.type || 'image/jpeg';
        const compressed = await compressAndConvertToBase64(file);
        dataUrl = compressed.base64;
      }

      setSelectedImageSrc(dataUrl);
      setFileName(fName);
      setFileSize(fSize);
      setFileType(fType);

      // Evaluate image quality
      const report = await evaluateImageQuality(dataUrl);
      setQualityReport(report);

      setStep('preview');
    } catch (err: any) {
      console.error('Error loading image:', err);
      setErrorMessage('Failed to load image. Please select a valid photo.');
      setStep('error');
    }
  };

  const handleSelectSample = (sample: SampleCropData) => {
    setSelectedImageSrc(sample.sampleImage);
    setFileName(`${sample.cropName} Specimen.png`);
    setFileSize('Sample Specimen');
    setFileType('image/png');
    setQualityReport({
      isValid: true,
      quality: 'good',
      warnings: [],
      suggestions: [],
    });
    setStep('preview');
  };

  const handleAnalyze = async (userNotes?: string) => {
    if (isAnalyzing || !selectedImageSrc) return;

    setIsAnalyzing(true);
    setStep('analyzing');
    setErrorMessage(null);
    setErrorStatus(null);
    setErrorDetails(null);

    try {
      // Send image to backend Gemini endpoint
      const result = await analyzeCropImage({
        imageBase64: selectedImageSrc,
        mimeType: fileType,
        userNotes,
      });

      // Attach thumbnail and set result
      const fullResult: AnalysisResult = {
        ...result,
        imageThumbnail: selectedImageSrc,
      };

      setAnalysisResult(fullResult);
      // Automatically save to local history for convenience
      saveAnalysisToHistory(fullResult);
      if (user) {
        syncAnalysisToCloud(user.uid, fullResult);
      }
      onSavedToHistory(fullResult);
      setIsSaved(true);
      setStep('result');
    } catch (err: any) {
      console.warn('Live Gemini analysis unavailable, switching to demo specimen reasoning:', err);
      if (err.isDemoFallback || err.status === 503 || !err.status) {
        handleRunDemoFallback();
        return;
      }

      setErrorStatus(err.status || 500);
      setErrorDetails(err.details || null);

      if (err.retryAfterSeconds && typeof err.retryAfterSeconds === 'number') {
        setRetryCountdown(err.retryAfterSeconds);
      }

      setErrorMessage(
        err.message || 'Unable to complete crop image analysis. Please verify your connection or try another photo.'
      );
      setStep('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunDemoFallback = () => {
    // Pick the most relevant sample or default to first sample
    const matchedSample = SAMPLE_CROPS.find(
      (s) => fileName.toLowerCase().includes(s.cropName.toLowerCase())
    ) || SAMPLE_CROPS[0];

    const fallbackResult: AnalysisResult = {
      ...matchedSample.result,
      id: `demo_${Date.now()}`,
      analyzedAt: new Date().toISOString(),
      imageThumbnail: selectedImageSrc || matchedSample.sampleImage,
      isDemo: true,
    };

    setAnalysisResult(fallbackResult);
    saveAnalysisToHistory(fallbackResult);
    if (user) {
      syncAnalysisToCloud(user.uid, fallbackResult);
    }
    onSavedToHistory(fallbackResult);
    setIsSaved(true);
    setStep('result');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await testGeminiConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        status: 'error',
        error: err.message || 'Failed to ping Gemini backend.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveResult = (result: AnalysisResult) => {
    saveAnalysisToHistory(result);
    if (user) {
      syncAnalysisToCloud(user.uid, result);
    }
    onSavedToHistory(result);
    setIsSaved(true);
  };

  const handleReset = () => {
    setSelectedImageSrc('');
    setFileName('');
    setFileSize('');
    setQualityReport(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setErrorStatus(null);
    setErrorDetails(null);
    setIsSaved(false);
    setIsAnalyzing(false);
    setStep('upload');
  };

  return (
    <div id="detect-pest-page-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Multimodal Pest & Disease Detection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-950 dark:text-white tracking-tight">
          Crop Diagnosis Studio
        </h1>
        <p className="text-sm sm:text-base text-emerald-800/80 dark:text-emerald-200/70">
          Upload a high-resolution photo or capture a live leaf specimen for instant visual reasoning.
        </p>
      </div>

      {/* Main Flow Render */}
      {step === 'upload' && (
        <UploadCard
          onImageSelected={handleImageSelected}
          onOpenLiveCamera={() => setIsCameraOpen(true)}
          language={language}
        />
      )}

      {step === 'preview' && (
        <ImagePreview
          imageSrc={selectedImageSrc}
          fileName={fileName}
          fileSize={fileSize}
          fileType={fileType}
          qualityReport={qualityReport}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          language={language}
        />
      )}

      {step === 'analyzing' && (
        <LoadingScreen imageSrc={selectedImageSrc} language={language} />
      )}

      {step === 'result' && analysisResult && (
        <ResultDashboard
          result={analysisResult}
          imageSrc={selectedImageSrc}
          onSave={handleSaveResult}
          isSaved={isSaved}
          onReset={handleReset}
          language={language}
        />
      )}

      {step === 'error' && (
        <div className="bg-white dark:bg-[#142017] border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-10 text-center space-y-6 max-w-xl mx-auto shadow-xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
              {errorStatus === 503 || errorStatus === 401 ? (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>API Key / Service Notice</span>
                </>
              ) : errorStatus === 429 ? (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Rate Limit Notice</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnostic Notice</span>
                </>
              )}
            </div>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              {errorStatus === 503
                ? 'Gemini API Key Required'
                : errorStatus === 429
                ? 'Rate Limit / Cooldown Active'
                : 'Analysis Notice'}
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-md mx-auto">
              {errorMessage || 'An error occurred while processing the crop image.'}
            </p>

            {errorDetails && (
              <div className="mt-3 p-3 bg-stone-50 dark:bg-stone-900/80 rounded-xl border border-stone-200 dark:border-stone-800 text-left text-xs font-mono text-stone-600 dark:text-stone-400 overflow-x-auto max-h-24">
                <span className="text-[10px] text-stone-400 uppercase block font-sans font-bold">Diagnostic Info:</span>
                {errorDetails}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || (retryCountdown !== null && retryCountdown > 0)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : retryCountdown !== null && retryCountdown > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                  <span>Cooldown ({retryCountdown}s)</span>
                </span>
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              <span>{retryCountdown !== null && retryCountdown > 0 ? 'Waiting Cooldown...' : 'Retry Analysis'}</span>
            </button>

            <button
              onClick={handleRunDemoFallback}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              title="Explore sample specimen diagnosis instantly without consuming API quota"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Explore Demo Result</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Choose Another Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Developer Diagnostic Panel */}
      <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDevPanel(!showDevPanel)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Developer Connection Diagnostic</span>
            {showDevPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showDevPanel && (
          <div className="mt-3 p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 rounded-2xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-950 dark:text-white">Gemini API Pipeline Diagnostics</p>
                <p className="text-emerald-800/80 dark:text-emerald-300/70 text-[11px]">
                  Verify that the backend Express server can communicate with Gemini AI using the active API key.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isTestingConnection ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                <span>Test Gemini Connection</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-white dark:bg-[#111c13] border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Connected Successfully ({testResult.latencyMs}ms)
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Connection Test Failed ({testResult.status})
                    </span>
                  )}
                </div>
                {testResult.model && <div>Model: <span className="text-emerald-700 dark:text-emerald-300">{testResult.model}</span></div>}
                {testResult.response && <div>Sample Response: <span className="text-stone-600 dark:text-stone-300">{testResult.response}</span></div>}
                {testResult.error && <div className="text-rose-600 dark:text-rose-400">{testResult.error}</div>}
                {testResult.hint && <div className="text-amber-600 dark:text-amber-400">{testResult.hint}</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setIsCameraOpen(false);
          handleImageSelected(dataUrl, `Camera_Shot_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`);
        }}
      />
    </div>
  );
};
