import { jsPDF } from 'jspdf';
import { Property } from '../types';

/**
 * Helper to safely convert an external image URL to a base64 JPEG data URL
 * Uses CORS-enabled Image and HTML Canvas with graceful fallback placeholder.
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    // If it's already a base64 data URL
    if (imageUrl.startsWith('data:image')) {
      resolve(imageUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 500;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataURL);
      } catch (err) {
        console.warn('Canvas export failed for image, using fallback:', err);
        resolve(createFallbackImage());
      }
    };

    img.onerror = () => {
      console.warn('Image load failed, using fallback:', imageUrl);
      resolve(createFallbackImage());
    };

    // Timeout safety in case external image hangs
    setTimeout(() => {
      resolve(createFallbackImage());
    }, 4000);
  });
}

/**
 * Creates an elegant dark gold fallback architectural card when an image cannot be loaded
 */
function createFallbackImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 800, 450);
    grad.addColorStop(0, '#101319');
    grad.addColorStop(0.5, '#1B212D');
    grad.addColorStop(1, '#0C0E14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    ctx.strokeStyle = '#C5A880';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 410);

    ctx.fillStyle = '#C5A880';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.fillText('FORTVÍDE ARCHITECTURAL RESIDENCE', 400, 210);

    ctx.fillStyle = '#A0A6B5';
    ctx.font = '14px sans-serif';
    ctx.fillText('Verified Private Office Listing', 400, 250);
  }
  return canvas.toDataURL('image/jpeg', 0.8);
}

export interface BrochureGenerationOptions {
  includeFloorplan?: boolean;
  clientName?: string;
  notes?: string;
}

export class PdfBrochureService {
  /**
   * Generates and downloads a multi-page, high-end luxury PDF brochure
   */
  public static async generatePropertyBrochure(
    property: Property,
    options: BrochureGenerationOptions = {}
  ): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4' // 210 x 297 mm
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2; // 180mm

    const goldColor = [197, 168, 128]; // #C5A880
    const darkBg = [15, 17, 22]; // #0F1116
    const slateText = [237, 232, 223]; // #EDE8DF
    const mutedText = [140, 148, 162]; // #8C94A2

    // Load main hero image and secondary gallery images in parallel
    const heroImgUrl = property.image;
    const galleryUrls = (property.gallery && property.gallery.length > 0)
      ? property.gallery.slice(0, 3)
      : [property.image];

    const [heroBase64, galleryBase64List] = await Promise.all([
      getBase64ImageFromUrl(heroImgUrl),
      Promise.all(galleryUrls.map(url => getBase64ImageFromUrl(url)))
    ]);

    // ==========================================
    // PAGE 1: COVER & ARCHITECTURAL HIGHLIGHTS
    // ==========================================

    // Background Fill
    doc.setFillColor(15, 17, 22);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Subtle Gold Border around entire page
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Top Header Monogram
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('FORTVÍDE LUXURY REAL ESTATE  •  EXCLUSIVE PRIVATE DOSSIER', pageWidth / 2, 16, { align: 'center' });

    // Thin accent divider
    doc.setDrawColor(60, 68, 85);
    doc.setLineWidth(0.2);
    doc.line(margin, 19, pageWidth - margin, 19);

    // Property Title & Location
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    
    // Split long titles if necessary
    const splitTitle = doc.splitTextToSize(property.title, contentWidth - 45);
    doc.text(splitTitle, margin, 27);

    const titleBottomY = 27 + (splitTitle.length - 1) * 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(`${property.location.toUpperCase()}  |  ${property.category.toUpperCase()}`, margin, titleBottomY + 5);

    // Price Badge (Top Right)
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(property.price);

    doc.setFillColor(25, 30, 42);
    doc.roundedRect(pageWidth - margin - 44, 22, 44, 11, 2, 2, 'F');
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(pageWidth - margin - 44, 22, 44, 11, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(formattedPrice, pageWidth - margin - 22, 29, { align: 'center' });

    // Hero Image Box
    const heroY = titleBottomY + 9;
    const heroHeight = 88;

    if (heroBase64) {
      try {
        doc.addImage(heroBase64, 'JPEG', margin, heroY, contentWidth, heroHeight);
        // Border around image
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.4);
        doc.rect(margin, heroY, contentWidth, heroHeight, 'S');
      } catch (err) {
        console.warn('Hero image placement error:', err);
      }
    }

    // Specifications Grid (4 Columns)
    const specY = heroY + heroHeight + 6;
    const specHeight = 18;
    const colWidth = contentWidth / 4;

    const specs = [
      { label: 'BEDROOMS', val: `${property.beds} Suites` },
      { label: 'BATHROOMS', val: `${property.baths} Baths` },
      { label: 'INTERIOR AREA', val: `${property.sqft.toLocaleString()} Sq Ft` },
      { label: 'TYPOLOGY', val: property.category }
    ];

    specs.forEach((spec, i) => {
      const colX = margin + i * colWidth;
      doc.setFillColor(20, 24, 34);
      doc.roundedRect(colX + 1, specY, colWidth - 2, specHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(38, 45, 60);
      doc.setLineWidth(0.2);
      doc.roundedRect(colX + 1, specY, colWidth - 2, specHeight, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(spec.label, colX + colWidth / 2, specY + 6, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      doc.text(spec.val, colX + colWidth / 2, specY + 13, { align: 'center' });
    });

    // Curated Property Description
    const descY = specY + specHeight + 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('ARCHITECTURAL OVERVIEW', margin, descY);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 195, 205);
    const splitDesc = doc.splitTextToSize(
      property.description || 'An unparalleled architectural masterpiece distinguished by rare proportions, museum-quality finishes, and panoramic vistas framing the skyline.',
      contentWidth
    );
    // Print first 4 lines max for page 1 balance
    const visibleLines = splitDesc.slice(0, 4);
    doc.text(visibleLines, margin, descY + 6);

    // Feature Highlights Chips
    const featY = descY + 6 + visibleLines.length * 4.2 + 4;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('KEY RESIDENCE AMENITIES', margin, featY);

    const featuresList = (property.features && property.features.length > 0)
      ? property.features.slice(0, 6)
      : ['Panoramic Terraces', 'Chef Exhibition Kitchen', 'Private Elevator Access', 'Integrated Smart Automation', 'Wine Tasting Cellar', 'Spa & Plunge Pool'];

    let currChipX = margin;
    let currChipY = featY + 4;
    const chipHeight = 6.5;

    featuresList.forEach((feat) => {
      const textWidth = doc.getTextWidth(feat) + 8;
      if (currChipX + textWidth > margin + contentWidth) {
        currChipX = margin;
        currChipY += chipHeight + 2;
      }
      doc.setFillColor(24, 29, 40);
      doc.roundedRect(currChipX, currChipY, textWidth, chipHeight, 1.2, 1.2, 'F');
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.2);
      doc.roundedRect(currChipX, currChipY, textWidth, chipHeight, 1.2, 1.2, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      doc.text(feat, currChipX + textWidth / 2, currChipY + 4.5, { align: 'center' });

      currChipX += textWidth + 3;
    });

    // Page 1 Footer
    doc.setDrawColor(40, 46, 60);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(`CONFIDENTIAL MEMORANDUM  •  REF: FTV-${property.id.slice(0, 8).toUpperCase()}`, margin, pageHeight - 11);
    doc.text('PAGE 1 OF 2', pageWidth - margin, pageHeight - 11, { align: 'right' });


    // ==========================================
    // PAGE 2: GALLERY & ADVISORY REPRESENTATION
    // ==========================================
    doc.addPage('a4', 'portrait');

    // Page 2 Background Fill & Border
    doc.setFillColor(15, 17, 22);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Header
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('FORTVÍDE LUXURY REAL ESTATE  •  INTERIOR GALLERIES & ADVISORY', pageWidth / 2, 16, { align: 'center' });

    doc.setDrawColor(60, 68, 85);
    doc.setLineWidth(0.2);
    doc.line(margin, 19, pageWidth - margin, 19);

    // Gallery Title
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text('SELECTED INTERIOR & EXTERIOR PERSPECTIVES', margin, 27);

    // Gallery Images (2 columns x 1 row or 2 rows)
    const galY = 32;
    const galImgWidth = (contentWidth - 6) / 2; // ~87mm
    const galImgHeight = 54;

    const validGalleryImgs = galleryBase64List.filter(Boolean) as string[];
    const firstImg = validGalleryImgs[0] || heroBase64;
    const secondImg = validGalleryImgs[1] || heroBase64;

    if (firstImg) {
      try {
        doc.addImage(firstImg, 'JPEG', margin, galY, galImgWidth, galImgHeight);
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.3);
        doc.rect(margin, galY, galImgWidth, galImgHeight, 'S');

        doc.setFillColor(15, 17, 22);
        doc.rect(margin, galY + galImgHeight - 6, galImgWidth, 6, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.text('GRAND RECEPTION & SALON', margin + 3, galY + galImgHeight - 2);
      } catch (e) {
        console.warn('First gallery image placement error:', e);
      }
    }

    if (secondImg) {
      try {
        doc.addImage(secondImg, 'JPEG', margin + galImgWidth + 6, galY, galImgWidth, galImgHeight);
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.3);
        doc.rect(margin + galImgWidth + 6, galY, galImgWidth, galImgHeight, 'S');

        doc.setFillColor(15, 17, 22);
        doc.rect(margin + galImgWidth + 6, galY + galImgHeight - 6, galImgWidth, 6, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.text('PRIMARY SUITE & HORIZON TERRACE', margin + galImgWidth + 9, galY + galImgHeight - 2);
      } catch (e) {
        console.warn('Second gallery image placement error:', e);
      }
    }

    // Submarket & Valuation Intelligence Section
    const intelY = galY + galImgHeight + 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('SUBMARKET INVESTMENT INTELLIGENCE', margin, intelY);

    doc.setFillColor(20, 24, 34);
    doc.roundedRect(margin, intelY + 3, contentWidth, 24, 1.5, 1.5, 'F');
    doc.setDrawColor(38, 45, 60);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, intelY + 3, contentWidth, 24, 1.5, 1.5, 'S');

    const priceSqFt = Math.round(property.price / (property.sqft || 5000));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`Location Index: ${property.location}`, margin + 5, intelY + 9);
    doc.text(`Estimated Valuation: $${priceSqFt.toLocaleString()} / Sq Ft`, margin + 5, intelY + 15);
    doc.text(`Historical 5-Year Submarket Appreciation: +34.2%`, margin + 5, intelY + 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('Certified Escrow Assessment', margin + contentWidth - 45, intelY + 9);
    doc.text('Global Ultra-Luxury Benchmark', margin + contentWidth - 45, intelY + 15);
    doc.text('Prime Sovereign Holding', margin + contentWidth - 45, intelY + 21);

    // Exclusive Listing Agent & Private Office Representation Card
    const agentCardY = intelY + 32;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('EXCLUSIVE PRIVATE BROKERAGE REPRESENTATION', margin, agentCardY);

    // Agent Box
    doc.setFillColor(22, 26, 36);
    doc.roundedRect(margin, agentCardY + 4, contentWidth, 54, 2, 2, 'F');
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, agentCardY + 4, contentWidth, 54, 2, 2, 'S');

    // Agent Name & Monogram
    const agentName = property.ownerName || 'Victoria Sterling';
    const agentEmail = property.ownerEmail || 'advisory@fortvide.com';
    const agentPhone = '+1 (310) 892-4400';

    // Stylized Monogram Circle
    doc.setFillColor(32, 38, 52);
    doc.circle(margin + 16, agentCardY + 20, 10, 'F');
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.4);
    doc.circle(margin + 16, agentCardY + 20, 10, 'S');

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(agentName.split(' ').map(n => n[0]).join('').slice(0, 2), margin + 16, agentCardY + 23.5, { align: 'center' });

    // Agent Credentials
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(agentName, margin + 32, agentCardY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('Senior Managing Director  •  Fortvíde Private Brokerage Group', margin + 32, agentCardY + 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(`Direct Telephone:  ${agentPhone}`, margin + 32, agentCardY + 29);
    doc.text(`Confidential Email:  ${agentEmail}`, margin + 32, agentCardY + 34);
    doc.text(`Global Office:  Fortvíde International Advisory, Geneva & Beverly Hills`, margin + 32, agentCardY + 39);

    // Private Consultation / Escrow Stamp Badge inside Agent Card
    doc.setFillColor(30, 36, 48);
    doc.roundedRect(margin + 32, agentCardY + 43, contentWidth - 38, 9, 1.2, 1.2, 'F');
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 32, agentCardY + 43, contentWidth - 38, 9, 1.2, 1.2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('PRIVATE IN-PERSON & CINEMATIC DRONE VIEWINGS AVAILABLE UPON REQUEST', margin + contentWidth / 2, agentCardY + 49, { align: 'center' });

    // Legal Disclaimers & Notes
    const notesY = agentCardY + 64;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 108, 122);
    const disclaimer = 'DISCLAIMER: This luxury property memorandum is provided exclusively for private consultation. All dimensions, square footage calculations, and architectural specifications are approximate and should be verified through certified architectural review and escrow survey. Offering subject to prior disposition or withdrawal without notice. © 2026 Fortvíde Luxury Real Estate. All rights reserved.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(splitDisclaimer, margin, notesY);

    // Page 2 Footer
    doc.setDrawColor(40, 46, 60);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const cleanDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`PUBLISHED: ${cleanDate.toUpperCase()}  •  FORTVIDE.COM/PRIVATE`, margin, pageHeight - 11);
    doc.text('PAGE 2 OF 2', pageWidth - margin, pageHeight - 11, { align: 'right' });

    // Sanitize filename and save
    const safeTitle = property.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
    doc.save(`Fortvide_${safeTitle}_Brochure.pdf`);
  }
}
