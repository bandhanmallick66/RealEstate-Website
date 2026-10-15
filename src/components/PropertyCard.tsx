import React, { useState } from 'react';
import { Property } from '../types';
import { Heart, MapPin, Bed, Bath, Maximize2, Calendar, FileDown, Loader2, Check } from 'lucide-react';
import { PdfBrochureService } from '../services/pdfBrochureService';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property, e: React.MouseEvent) => void;
  isOwner?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onBookViewing,
  isOwner
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const handleQuickDownloadPdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await PdfBrochureService.generatePropertyBrochure(property);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error downloading brochure:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div
      id={`property-card-${property.id}`}
      onClick={() => onSelectProperty(property)}
      className="group relative bg-[#101319] rounded-xl overflow-hidden border border-[#202532] hover:border-[#C5A880]/70 transform transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.018] hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.9),0_0_30px_rgba(197,168,128,0.18)] flex flex-col cursor-pointer will-change-transform"
    >
      {/* Subtle Luxury Gold Sheen Vignette on Hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#C5A880]/[0.04] via-transparent to-[#C5A880]/[0.06] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Top Image Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0A0C0E]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.92] group-hover:brightness-100"
          loading="lazy"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-[#101319]/20 to-black/40 pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
          {property.featured && (
            <span className="bg-black/60 backdrop-blur-md text-[10px] tracking-[0.2em] text-[#E5C38C] font-semibold px-2.5 py-1 rounded uppercase border border-[#C5A880]/30 shadow-sm">
              FEATURED
            </span>
          )}
          <span className="bg-[#14171E]/80 backdrop-blur-md text-[9px] tracking-widest text-[#B5BAC6] font-medium px-2 py-0.5 rounded uppercase border border-white/10">
            {property.category}
          </span>
          {isOwner && (
            <span className="bg-[#C5A880]/20 backdrop-blur-md text-[9px] tracking-widest text-[#C5A880] font-semibold px-2 py-0.5 rounded uppercase border border-[#C5A880]/40">
              Your Listing
            </span>
          )}
        </div>

        {/* Top Right Actions: Favorite & Quick PDF Brochure */}
        <div className="absolute top-3.5 right-3.5 flex items-center space-x-1.5 z-20">
          {/* Quick PDF Brochure Download */}
          <button
            id={`download-pdf-card-btn-${property.id}`}
            onClick={handleQuickDownloadPdf}
            disabled={isDownloadingPdf}
            aria-label="Download PDF Brochure"
            title="Download Custom PDF Brochure"
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#C5A880] hover:text-white hover:bg-[#C5A880]/40 transition-all hover:scale-110 active:scale-95 shadow-md disabled:opacity-60"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
            ) : isSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Favorite Button */}
          <button
            id={`favorite-btn-${property.id}`}
            onClick={(e) => onToggleFavorite(property.id, e)}
            aria-label="Save to favorites"
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#C5A880] hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-[#C5A880] text-[#C5A880]' : 'text-white/80'
              }`}
            />
          </button>
        </div>

        {/* Quick View overlay button */}
        <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[11px] uppercase tracking-wider text-[#EDE8DF] font-medium bg-black/70 backdrop-blur-md px-3 py-1 rounded">
            Explore Details
          </span>
          <button
            onClick={(e) => onBookViewing(property, e)}
            className="bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded shadow-md transition-colors flex items-center"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Book Viewing
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-[#8D93A1] text-xs uppercase tracking-wider mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#C5A880] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#EDE8DF] group-hover:text-[#C5A880] transition-colors leading-snug line-clamp-1">
            {property.title}
          </h3>

          {/* Specs: Beds • Baths • Sq Ft */}
          <div className="mt-2.5 text-xs text-[#9DA2B0] font-sans flex items-center space-x-2">
            {property.category === 'Plot' ? (
              <span className="flex items-center">
                <Maximize2 className="w-3.5 h-3.5 mr-1 text-[#C5A880]/70" />
                {property.sqft.toLocaleString()} Sq Ft Land Plot
              </span>
            ) : (
              <>
                <span className="flex items-center">
                  <Bed className="w-3.5 h-3.5 mr-1 text-[#C5A880]/70" />
                  {property.beds} Beds
                </span>
                <span className="text-[#3A3F4D]">•</span>
                <span className="flex items-center">
                  <Bath className="w-3.5 h-3.5 mr-1 text-[#C5A880]/70" />
                  {property.baths} Baths
                </span>
                <span className="text-[#3A3F4D]">•</span>
                <span className="flex items-center">
                  <Maximize2 className="w-3.5 h-3.5 mr-1 text-[#C5A880]/70" />
                  {property.sqft.toLocaleString()} Sq Ft
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Price Bar */}
        <div className="mt-4 pt-3 border-t border-[#1C202A] flex items-center justify-between">
          <div className="text-[#C5A880] font-serif text-lg sm:text-xl font-semibold tracking-wide">
            {formattedPrice}
          </div>
          <span className="text-[11px] tracking-wider text-[#A0A5B2] uppercase font-sans group-hover:text-[#EDE8DF] transition-colors">
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
