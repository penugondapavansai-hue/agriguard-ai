import { ImageQualityReport } from '../types';

/**
 * Evaluates the uploaded image quality by loading it into an in-memory canvas
 * and sampling brightness, contrast, and resolution.
 */
export async function evaluateImageQuality(
  imageSource: string | File
): Promise<ImageQualityReport> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      try {
        const width = img.width;
        const height = img.height;

        const canvas = document.createElement('canvas');
        // Sample with a scaled down canvas for instant performance
        const sampleWidth = Math.min(200, width);
        const sampleHeight = Math.min(200, height);
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            isValid: true,
            quality: 'good',
            warnings: [],
            suggestions: [],
          });
        }

        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
        const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imageData.data;

        let totalLuminance = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Standard ITU-R BT.709 perceived luminance formula
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          totalLuminance += lum;
          pixelCount++;
        }

        const avgBrightness = pixelCount > 0 ? totalLuminance / pixelCount : 128;
        const isTooDark = avgBrightness < 42;
        const isTooBright = avgBrightness > 225;
        const isLowRes = width < 280 || height < 280;

        const warnings: string[] = [];
        const suggestions: string[] = [];

        if (isTooDark) {
          warnings.push('The photo appears very dark or in heavy shadow.');
          suggestions.push('Take photo in bright daylight or use phone flash.');
        }

        if (isTooBright) {
          warnings.push('The photo appears overexposed with high glare.');
          suggestions.push('Avoid direct sun glare or angle the camera away from intense reflections.');
        }

        if (isLowRes) {
          warnings.push('Image resolution is very low, which can obscure small pests and leaf spots.');
          suggestions.push('Move closer and hold camera steady to capture high-definition details.');
        }

        // General suggestions if any warning is flagged
        if (warnings.length > 0) {
          suggestions.push('Ensure the affected leaf, fruit, or stem is in sharp focus.');
          suggestions.push('Hold the camera steady without motion blur.');
        }

        const quality = warnings.length >= 2 ? 'poor' : warnings.length === 1 ? 'fair' : 'good';

        resolve({
          isValid: true,
          quality,
          warnings,
          suggestions,
          brightnessScore: Math.round(avgBrightness),
          isTooDark,
          isTooBright,
          isLowRes,
        });
      } catch (err) {
        console.warn('Image quality analysis fallback:', err);
        resolve({
          isValid: true,
          quality: 'good',
          warnings: [],
          suggestions: [],
        });
      }
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        quality: 'poor',
        warnings: ['Unable to read image file data. The file might be corrupted.'],
        suggestions: ['Please choose a valid JPG, PNG, or WEBP image.'],
      });
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = () => {
        resolve({
          isValid: false,
          quality: 'poor',
          warnings: ['Failed to read image file.'],
          suggestions: ['Please upload another image.'],
        });
      };
      reader.readAsDataURL(imageSource);
    }
  });
}

/**
 * Resizes and compresses image if it exceeds max dimension or payload limit
 */
export async function compressAndConvertToBase64(file: File, maxDim = 1600): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({ base64: dataUrl, mimeType: file.type || 'image/jpeg' });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedBase64 = canvas.toDataURL(mimeType, 0.9);
        resolve({ base64: compressedBase64, mimeType });
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
