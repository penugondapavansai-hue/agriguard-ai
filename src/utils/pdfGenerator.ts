import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types';

interface GeneratePdfOptions {
  result: AnalysisResult;
  imageSrc?: string;
  language?: string;
}

// Helper to load image as base64 if it's an external or blob URL
const getImageDataUrl = async (url: string): Promise<string | null> => {
  if (!url) return null;
  if (url.startsWith('data:image/')) return url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      } catch (err) {
        console.warn('Could not convert image to base64 for PDF:', err);
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
};

export const generateCropReportPdf = async ({
  result,
  imageSrc,
}: GeneratePdfOptions): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Color Palette Constants
  const BRAND_DARK = [19, 32, 23]; // #132017 Deep emerald-stone
  const BRAND_EMERALD = [5, 150, 105]; // #059669 Emerald-600
  const BRAND_LIGHT_BG = [240, 253, 244]; // #f0fdf4 Emerald-50
  const TEXT_PRIMARY = [30, 41, 59]; // #1e293b Slate-800
  const TEXT_MUTED = [100, 116, 139]; // #64748b Slate-500
  const BORDER_COLOR = [226, 232, 240]; // #e2e8f0 Slate-200
  const AMBER_COLOR = [217, 119, 6]; // #d97706 Amber-600

  // Helper to ensure new page if Y overflows
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin;
      addPageHeaderSimple();
    }
  };

  const addPageHeaderSimple = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('AgriGuard AI – Plant Diagnostic & Crop Health Report', margin, currentY);
    doc.text(new Date().toLocaleDateString('en-US'), pageWidth - margin, currentY, { align: 'right' });
    currentY += 4;
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;
  };

  // --- 1. Top Header Banner ---
  doc.setFillColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.roundedRect(margin, currentY, contentWidth, 24, 3, 3, 'F');

  // Title inside banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('🌱 AGRIGUARD AI', margin + 6, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208); // Emerald-200
  doc.text('Crop Health & Pest Diagnostic Report (Offline Reference)', margin + 6, currentY + 16);

  // Date and Report ID on Right
  const formattedDate = new Date(result.analyzedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`Date: ${formattedDate}`, pageWidth - margin - 6, currentY + 9, { align: 'right' });
  doc.text(`Severity: ${result.severity || 'Moderate'}`, pageWidth - margin - 6, currentY + 16, { align: 'right' });

  currentY += 28;

  // --- 2. Specimen & Core Overview Box ---
  let imageBase64Data: string | null = null;
  if (imageSrc) {
    try {
      imageBase64Data = await getImageDataUrl(imageSrc);
    } catch (e) {
      console.warn('Failed to prepare image for PDF', e);
    }
  }

  const overviewBoxY = currentY;
  const overviewBoxHeight = imageBase64Data ? 48 : 34;

  // Background Box
  doc.setFillColor(BRAND_LIGHT_BG[0], BRAND_LIGHT_BG[1], BRAND_LIGHT_BG[2]);
  doc.setDrawColor(BRAND_EMERALD[0], BRAND_EMERALD[1], BRAND_EMERALD[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, overviewBoxY, contentWidth, overviewBoxHeight, 3, 3, 'FD');

  let textLeftX = margin + 6;

  // If image available, draw specimen photo thumbnail
  if (imageBase64Data) {
    try {
      doc.addImage(imageBase64Data, 'JPEG', margin + 4, overviewBoxY + 4, 52, 40);
      textLeftX = margin + 60;
    } catch (e) {
      console.warn('Could not add image into PDF canvas:', e);
      textLeftX = margin + 6;
    }
  }

  // Crop Title & Identified Problem
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.text(`Crop: ${result.crop || 'Plant Specimen'}`, textLeftX, overviewBoxY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(AMBER_COLOR[0], AMBER_COLOR[1], AMBER_COLOR[2]);
  const problemLines = doc.splitTextToSize(`Problem: ${result.problem || 'Unknown Problem'}`, contentWidth - (textLeftX - margin) - 4);
  doc.text(problemLines, textLeftX, overviewBoxY + 16);

  // Confidence & Severity Sub-metrics
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_PRIMARY[0], TEXT_PRIMARY[1], TEXT_PRIMARY[2]);

  let metricsY = overviewBoxY + 23;
  if (problemLines.length > 1) {
    metricsY += (problemLines.length - 1) * 4;
  }

  const confLevel = result.confidenceLevel || 'LIKELY';
  doc.text(`AI Confidence Estimate: ${result.confidence}% (${confLevel})`, textLeftX, metricsY);
  doc.text(`Severity Level: ${result.severity || 'Moderate'}`, textLeftX, metricsY + 6);
  if (result.isDemo) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(AMBER_COLOR[0], AMBER_COLOR[1], AMBER_COLOR[2]);
    doc.text('* Sample Specimen Demo Data', textLeftX, metricsY + 12);
  }

  currentY += overviewBoxHeight + 6;

  // --- Helper to render formatted sections with icons and bullet points ---
  const renderSection = (title: string, items?: string[], noteText?: string, isWarning = false) => {
    if ((!items || items.length === 0) && !noteText) return;

    checkPageBreak(18 + (items ? items.length * 6 : 0));

    // Section Header Box
    doc.setFillColor(isWarning ? 254 : 241, isWarning ? 242 : 245, isWarning ? 242 : 249); // soft tint
    doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(isWarning ? 185 : BRAND_EMERALD[0], isWarning ? 28 : BRAND_EMERALD[1], isWarning ? 28 : BRAND_EMERALD[2]);
    doc.text(title.toUpperCase(), margin + 3, currentY + 5);
    currentY += 10;

    // Single paragraph / Note text if present
    if (noteText) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(TEXT_PRIMARY[0], TEXT_PRIMARY[1], TEXT_PRIMARY[2]);
      const splitNote = doc.splitTextToSize(noteText, contentWidth - 6);
      checkPageBreak(splitNote.length * 4.5);
      doc.text(splitNote, margin + 4, currentY);
      currentY += splitNote.length * 4.5 + 2;
    }

    // Bullet items
    if (items && items.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(TEXT_PRIMARY[0], TEXT_PRIMARY[1], TEXT_PRIMARY[2]);

      for (const item of items) {
        const bulletText = `•  ${item}`;
        const splitItem = doc.splitTextToSize(bulletText, contentWidth - 8);
        checkPageBreak(splitItem.length * 4.5 + 2);
        doc.text(splitItem, margin + 4, currentY);
        currentY += splitItem.length * 4.5 + 1.5;
      }
    }

    currentY += 3;
  };

  // --- 3. Observed Symptoms ---
  renderSection(
    '1. Observed Visual Symptoms',
    result.visualSymptoms,
    result.visualSymptoms?.length ? undefined : 'No distinct external lesions or insect marks clearly observed.'
  );

  // --- 4. Possible Causes ---
  if (result.possibleCauses && result.possibleCauses.length > 0) {
    renderSection('2. Possible Causes', result.possibleCauses);
  }

  // --- 5. Recommended Next Steps ---
  renderSection('3. Recommended Immediate Next Steps', result.recommendations);

  // --- 6. Integrated Pest Management (IPM) ---
  if (result.ipm && result.ipm.length > 0) {
    renderSection('4. Integrated Pest Management (IPM) Protocols', result.ipm);
  }

  // --- 7. Prevention & Field Hygiene ---
  if (result.prevention && result.prevention.length > 0) {
    renderSection('5. Preventative & Cultural Field Hygiene', result.prevention);
  }

  // --- 8. Monitoring Schedule ---
  if (result.monitoring && result.monitoring.length > 0) {
    renderSection('6. Monitoring & Scouting Schedule', result.monitoring);
  }

  // --- 9. When to Consult an Agricultural Expert ---
  if (result.expertAdvice) {
    checkPageBreak(24);
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.setDrawColor(AMBER_COLOR[0], AMBER_COLOR[1], AMBER_COLOR[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // Amber-900
    doc.text('👨‍🌾 WHEN TO CONSULT A QUALIFIED AGRICULTURAL EXPERT', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    const expertLines = doc.splitTextToSize(result.expertAdvice, contentWidth - 8);
    doc.text(expertLines, margin + 4, currentY + 10);
    currentY += 22;
  }

  // --- 10. Safety Disclaimer & Page Footer on all pages ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom Divider
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    // Disclaimer text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(
      'Disclaimer: AgriGuard AI provides AI-assisted visual analysis for informational reference only. Not a substitute for professional agricultural diagnosis.',
      margin,
      pageHeight - 9
    );

    // Page Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }

  // Save the generated PDF
  const sanitizedCrop = (result.crop || 'crop').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `AgriGuard_Report_${sanitizedCrop}_${Date.now()}.pdf`;
  doc.save(filename);
};
