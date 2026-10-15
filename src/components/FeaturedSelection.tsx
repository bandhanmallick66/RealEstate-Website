import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { ArrowRight } from 'lucide-react';

interface FeaturedSelectionProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property, e: React.MouseEvent) => void;
  onViewAll: () => void;
  currentUserId?: string;
}

export const FeaturedSelection: React.FC<FeaturedSelectionProps> = ({
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onBookViewing,
  onViewAll,
  currentUserId
}) => {
  // Grab the top 3 featured properties matching the reference design
  const featured = properties
    .filter(p => p.featured || p.isExclusive)
    .slice(0, 3);

  return (
    <section id="featured-selection-section" className="py-20 bg-[#0B0C0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & View All button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
              FEATURED PROPERTIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#EDE8DF] font-light leading-tight">
              Discover Our Finest Selection
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A880] my-3.5" />
            <p className="text-xs sm:text-sm text-[#8E94A4] font-light leading-relaxed">
              From iconic penthouses to serene retreats, find a home that defines your lifestyle.
            </p>
          </div>

          <div>
            <button
              id="view-all-properties-top-btn"
              onClick={onViewAll}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-md active:scale-95"
            >
              <span>VIEW ALL PROPERTIES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              isFavorite={favorites.includes(prop.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectProperty={onSelectProperty}
              onBookViewing={onBookViewing}
              isOwner={currentUserId === prop.ownerId}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
