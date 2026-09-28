import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsInitializing(false);
      setError(
        'Unable to access camera. Please make sure camera permissions are granted in your browser or try selecting an image file directly.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        stopCamera();
        onCapture(dataUrl);
      }
    } catch (err) {
      console.error('Failed to capture frame:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#142017] border border-emerald-900/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-900/60 bg-[#0e1610] text-white">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-emerald-100">Crop Specimen Camera</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-emerald-400/70 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-emerald-300 bg-black/75 z-10">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium">Connecting to camera sensor...</p>
            </div>
          )}

          {error ? (
            <div className="p-6 text-center max-w-md space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-sm text-stone-300 font-medium">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder focus reticle & overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-64 h-64 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-600/90 text-white rounded-full text-[11px] font-bold tracking-wider uppercase">
                    Focus Target
                  </div>
                  <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                  <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                  <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                  <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
                </div>
              </div>

              {/* Lighting tip pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#142017]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-200 border border-emerald-800/50 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Keep leaf steady in good daylight</span>
              </div>
            </>
          )}
        </div>

        {/* Controls footer */}
        <div className="flex items-center justify-around p-4 bg-[#0e1610] border-t border-emerald-900/60">
          <button
            onClick={switchCamera}
            disabled={Boolean(error) || isInitializing}
            className="flex flex-col items-center gap-1 text-xs text-emerald-300 hover:text-white disabled:opacity-40 transition-colors p-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Flip Lens</span>
          </button>

          <button
            id="camera-shutter-btn"
            onClick={takePhoto}
            disabled={Boolean(error) || isInitializing}
            className="relative p-1 rounded-full border-4 border-emerald-500 hover:border-emerald-400 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer"
            title="Take Photo"
          >
            <div className="w-14 h-14 rounded-full bg-white hover:bg-emerald-50 transition-colors flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-emerald-950" />
            </div>
          </button>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex flex-col items-center gap-1 text-xs text-emerald-300 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
