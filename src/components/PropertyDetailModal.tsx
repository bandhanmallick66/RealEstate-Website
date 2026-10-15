import React, { useState } from 'react';
import { Property } from '../types';
import { HistoricalPriceChart } from './HistoricalPriceChart';
import { VirtualTour360Viewer } from './VirtualTour360Viewer';
import { PdfBrochureService } from '../services/pdfBrochureService';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Heart, 
  Share2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  MessageSquare,
  Compass,
  Camera,
  FileDown,
  Download,
  Loader2
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBookViewing: (property: Property) => void;
  onOpenAgentChat?: (property: Property) => void;
  isOwner?: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBookViewing,
  onOpenAgentChat,
  isOwner
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mediaMode, setMediaMode] = useState<'gallery' | 'virtual-tour'>('gallery');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const images = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdfBrochure = async () => {
    if (isGeneratingPdf || !property) return;
    try {
      setIsGeneratingPdf(true);
      await PdfBrochureService.generatePropertyBrochure(property);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to generate PDF brochure:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div id="property-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative bg-[#0F1116] border border-[#222631] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-[#E0E2E7] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 p-4 bg-[#0F1116]/90 backdrop-blur-md border-b border-[#1C2029]">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-1 rounded border border-[#C5A880]/30">
              {property.category}
            </span>
            {property.featured && (
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-semibold text-[#E5C38C] bg-black/60 px-2.5 py-1 rounded border border-[#C5A880]/30">
                FEATURED
              </span>
            )}
            {isOwner && (
              <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Your Listing
              </span>
            )}
          </div>

          {/* Media Mode Switcher (Photo Gallery vs 360° Virtual Tour) */}
          <div className="flex items-center bg-[#141822] p-1 rounded-full border border-[#262D3D]">
            <button
              id="media-mode-gallery-btn"
              onClick={() => setMediaMode('gallery')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all flex items-center space-x-1.5 ${
                mediaMode === 'gallery'
                  ? 'bg-[#C5A880] text-[#0A0C10] shadow-sm'
                  : 'text-[#8E95A5] hover:text-[#EDE8DF]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photos ({images.length})</span>
            </button>

            <button
              id="media-mode-tour-btn"
              onClick={() => setMediaMode('virtual-tour')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all flex items-center space-x-1.5 ${
                mediaMode === 'virtual-tour'
                  ? 'bg-gradient-to-r from-[#D0B388] to-[#C5A880] text-[#0A0C10] shadow-[0_0_12px_rgba(197,168,128,0.4)] font-bold'
                  : 'text-[#8E95A5] hover:text-[#EDE8DF]'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C5A880]"></span>
              </span>
              <Compass className="w-3.5 h-3.5" />
              <span>360° Tour</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download Custom PDF Brochure */}
            <button
              id="header-download-pdf-btn"
              onClick={handleDownloadPdfBrochure}
              disabled={isGeneratingPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#C5A880] border border-[#262B37] hover:border-[#C5A880]/50 transition-all text-xs font-medium active:scale-95 disabled:opacity-60"
              title="Generate & Download Custom PDF Brochure"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                  <span className="hidden sm:inline text-[#C5A880]">Compiling PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400 font-medium">Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="hidden sm:inline">PDF Brochure</span>
                </>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#C5A880] border border-[#262B37] transition-colors"
              title="Copy Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Favorite */}
            <button
              onClick={(e) => onToggleFavorite(property.id, e)}
              className="p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#C5A880] border border-[#262B37] transition-colors"
              title="Save Residence"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#C5A880] text-[#C5A880]' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#FFF] border border-[#262B37] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Carousel / 360 Tour Viewer */}
        {mediaMode === 'virtual-tour' ? (
          <VirtualTour360Viewer
            property={property}
            onCloseTour={() => setMediaMode('gallery')}
          />
        ) : (
          <div className="relative aspect-[16/10] sm:aspect-[21/10] bg-[#0A0C0E] overflow-hidden group">
            <img
              src={images[activeImageIdx]}
              alt={property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Floating 360 Virtual Tour Launcher Badge */}
            <button
              onClick={() => setMediaMode('virtual-tour')}
              className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#0E1117]/85 hover:bg-[#141822] border border-[#C5A880]/60 hover:border-[#C5A880] text-[#EDE8DF] hover:text-[#C5A880] backdrop-blur-md shadow-xl flex items-center space-x-2 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A880] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Launch 360° Tour</span>
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:text-[#C5A880] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:text-[#C5A880] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails preview dots */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIdx === idx ? 'w-6 bg-[#C5A880]' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Header Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C2029] pb-6">
            <div>
              <div className="flex items-center text-xs text-[#8A90A0] uppercase tracking-wider mb-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] mr-1" />
                <span>{property.location} • {property.country}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#EDE8DF] font-light">
                {property.title}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="block text-[10px] tracking-widest uppercase text-[#858C9B]">
                OFFERING PRICE
              </span>
              <span className="font-serif text-2xl sm:text-3xl text-[#C5A880] font-semibold">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141720] border border-[#202532]">
            {property.category === 'Plot' ? (
              <div className="col-span-2 sm:col-span-4 flex items-center space-x-3 p-2">
                <Maximize2 className="w-6 h-6 text-[#C5A880]" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#8A90A0]">
                    Total Site Plot Area
                  </span>
                  <span className="font-serif text-lg text-[#EDE8DF]">
                    {property.sqft.toLocaleString()} Sq Ft Land
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-2">
                  <Bed className="w-5 h-5 text-[#C5A880]" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#8A90A0]">Bedrooms</span>
                    <span className="font-serif text-base text-[#EDE8DF]">{property.beds} Suites</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <Bath className="w-5 h-5 text-[#C5A880]" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#8A90A0]">Bathrooms</span>
                    <span className="font-serif text-base text-[#EDE8DF]">{property.baths} Bathrooms</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <Maximize2 className="w-5 h-5 text-[#C5A880]" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#8A90A0]">Living Area</span>
                    <span className="font-serif text-base text-[#EDE8DF]">{property.sqft.toLocaleString()} Sq Ft</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2">
                  <Sparkles className="w-5 h-5 text-[#C5A880]" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#8A90A0]">Status</span>
                    <span className="font-serif text-base text-[#EDE8DF]">Available</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Architectural Description */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-2.5">
              Architectural Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#9CA2B2] font-light leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-3">
                Key Residence Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#C5CBD8]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D3 Historical Submarket Price Trends */}
          <HistoricalPriceChart property={property} />

          {/* Custom PDF Brochure Card Banner */}
          <div 
            id="pdf-brochure-download-card"
            className="rounded-2xl bg-gradient-to-r from-[#11141C] via-[#161B26] to-[#11141C] border border-[#C5A880]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden"
          >
            {/* Subtle background luxury glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A880]/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#1C2230] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880] shrink-0 shadow-inner">
                <FileDown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-serif font-semibold text-[#EDE8DF] tracking-wide">
                    Curated Property PDF Brochure
                  </h4>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] font-semibold border border-[#C5A880]/30">
                    2-PAGE DOSSIER
                  </span>
                </div>
                <p className="text-[11px] text-[#8C93A4] mt-0.5 max-w-xl">
                  Official high-resolution memorandum containing architectural elevations, room specifications, submarket price appreciation analysis, and direct advisory credentials.
                </p>
              </div>
            </div>

            <button
              id="body-download-pdf-btn"
              onClick={handleDownloadPdfBrochure}
              disabled={isGeneratingPdf}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#C5A880] hover:bg-[#d6bc96] text-[#0A0C10] text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_25px_rgba(197,168,128,0.5)] shrink-0 active:scale-95 disabled:opacity-70 relative z-10"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 font-bold" />
                  <span className="font-bold">Brochure Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Dossier</span>
                </>
              )}
            </button>
          </div>

          {/* Representation & Booking Action */}
          <div className="pt-6 border-t border-[#1C2029] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#181C24] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-[#7C8290]">
                  LISTED & VERIFIED BY
                </span>
                <span className="text-xs font-semibold text-[#EDE8DF]">
                  {property.ownerName || 'FORTVÍDE Private Office'}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              {onOpenAgentChat && (
                <button
                  id="modal-agent-chat-btn"
                  onClick={() => {
                    onOpenAgentChat(property);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-lg border border-[#C5A880]/50 hover:bg-[#C5A880]/15 text-[#C5A880] hover:text-[#EDE8DF] text-xs font-semibold tracking-[0.16em] uppercase transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Agent</span>
                </button>
              )}
              <button
                id="modal-book-viewing-btn"
                onClick={() => {
                  onClose();
                  onBookViewing(property);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Private Viewing</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
