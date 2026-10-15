import React, { useState, useMemo } from 'react';
import { Property, PropertyCategory } from '../types';
import { PropertyCard } from './PropertyCard';
import { Search, SlidersHorizontal, RotateCcw, X, Sparkles, MapPin, Tag } from 'lucide-react';

interface PropertiesSectionProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property, e: React.MouseEvent) => void;
  currentUserId?: string;
  initialCategory?: PropertyCategory | 'All';
}

const TRENDING_KEYWORDS = [
  'Miami',
  'Dubai',
  'Lake Como',
  'Penthouse',
  'Waterfront',
  'Infinity Pool',
  'Wine Cellar',
  'Plot'
];

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onBookViewing,
  currentUserId,
  initialCategory = 'All'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-desc' | 'price-asc' | 'newest'>('featured');

  const categories: (PropertyCategory | 'All')[] = ['All', 'House', 'Apartment', 'Plot'];

  // Multi-term real-time search and filter logic
  const filteredProperties = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const queryTokens = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

    return properties
      .filter((prop) => {
        // Category filter
        if (selectedCategory !== 'All' && prop.category !== selectedCategory) {
          return false;
        }

        // Real-time search query matching across title, location, city, country, description, and features
        if (queryTokens.length > 0) {
          const searchablePool = [
            prop.title,
            prop.location,
            prop.city,
            prop.country,
            prop.category,
            prop.description,
            ...(prop.features || [])
          ]
            .join(' ')
            .toLowerCase();

          // Every token in the search query must match in the searchable pool
          const matchesAllTokens = queryTokens.every((token) => searchablePool.includes(token));
          if (!matchesAllTokens) {
            return false;
          }
        }

        // Price range filter
        if (priceRange === 'under-15m' && prop.price >= 15000000) return false;
        if (priceRange === '15m-25m' && (prop.price < 15000000 || prop.price > 25000000)) return false;
        if (priceRange === 'above-25m' && prop.price <= 25000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [properties, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('featured');
  };

  const handleApplyKeyword = (keyword: string) => {
    if (searchQuery.toLowerCase().includes(keyword.toLowerCase())) {
      // If already present, remove it
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const updated = searchQuery.replace(regex, '').trim();
      setSearchQuery(updated);
    } else {
      // Append or set keyword
      setSearchQuery((prev) => (prev.trim() ? `${prev.trim()} ${keyword}` : keyword));
    }
  };

  return (
    <section id="properties-section" className="py-12 sm:py-16 bg-[#07080A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 mb-2 px-3 py-1 rounded-full bg-[#12151B] border border-[#C5A880]/30">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A880] uppercase font-semibold">
              CURATED GLOBAL PORTFOLIO
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#EDE8DF] font-light tracking-tight">
            Discover Exceptional Living
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#8E94A4] font-light leading-relaxed">
            Search our world-class inventory of private architectural estates, sky-high penthouses, and prime coastal parcels.
          </p>
        </div>

        {/* Real-Time Search & Filters Command Center */}
        <div className="bg-[#0E1117] border border-[#202533] p-5 sm:p-7 rounded-2xl mb-10 shadow-2xl space-y-6">
          
          {/* Main Real-Time Search Bar */}
          <div className="space-y-3">
            <div className="relative flex items-center">
              {/* Search Icon with Luxury Gold Tone */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#C5A880]">
                <Search className="w-5 h-5 transition-transform duration-200" />
              </div>

              {/* Real-Time Input Field */}
              <input
                id="property-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real-time by residence name, city (e.g. Miami, Dubai), or keywords (e.g. pool, waterfront, plot)..."
                className="w-full bg-[#141822] border border-[#262C3C] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 text-sm text-[#EDE8DF] pl-12 pr-28 py-3.5 rounded-xl outline-none transition-all placeholder:text-[#656D7F] shadow-inner"
              />

              {/* Right Side Controls in Search Bar */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="p-1.5 rounded-full bg-[#1C212E] hover:bg-[#282F42] text-[#9A9FA9] hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                
                {/* Result count pill */}
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-[#1C212E] border border-[#2A3245] text-[11px] font-medium text-[#C5A880]">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'match' : 'matches'}
                </span>
              </div>
            </div>

            {/* Trending Keyword Suggestions */}
            <div className="flex items-center flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-[#787F90] flex items-center mr-1">
                <Tag className="w-3 h-3 text-[#C5A880] mr-1" />
                Suggested:
              </span>
              {TRENDING_KEYWORDS.map((kw) => {
                const isApplied = searchQuery.toLowerCase().includes(kw.toLowerCase());
                return (
                  <button
                    key={kw}
                    onClick={() => handleApplyKeyword(kw)}
                    className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isApplied
                        ? 'bg-[#C5A880] text-[#07080A] font-semibold shadow-sm'
                        : 'bg-[#151923] text-[#959CAE] hover:text-[#EDE8DF] hover:bg-[#1E2433] border border-[#242A3B]'
                    }`}
                  >
                    {isApplied ? `✕ ${kw}` : `+ ${kw}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters Bar: Categories, Price, and Sorting */}
          <div className="pt-4 border-t border-[#1C2230] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Category Filter Pills (6 cols on lg) */}
            <div className="lg:col-span-6 flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-[11px] text-[#7A808E] uppercase tracking-wider mr-1 hidden sm:inline">
                Type:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`filter-cat-${cat.toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#C5A880] text-[#0B0C0E] font-semibold shadow-md'
                        : 'bg-[#141822] text-[#9A9FA9] hover:text-[#EDE8DF] hover:bg-[#1C2230] border border-[#23293A]'
                    }`}
                  >
                    {cat === 'All' ? 'All Residences' : cat}
                  </button>
                );
              })}
            </div>

            {/* Price Filter (3 cols on lg) */}
            <div className="lg:col-span-3">
              <select
                id="property-price-filter"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-[#141822] border border-[#23293A] focus:border-[#C5A880] text-xs text-[#C0C4D0] px-3.5 py-2.5 rounded-lg outline-none transition-colors cursor-pointer"
              >
                <option value="all">Any Price</option>
                <option value="under-15m">Under $15,000,000</option>
                <option value="15m-25m">$15,000,000 – $25,000,000</option>
                <option value="above-25m">Above $25,000,000</option>
              </select>
            </div>

            {/* Sort Filter (3 cols on lg) */}
            <div className="lg:col-span-3">
              <select
                id="property-sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#141822] border border-[#23293A] focus:border-[#C5A880] text-xs text-[#C0C4D0] px-3.5 py-2.5 rounded-lg outline-none transition-colors cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>

          </div>

          {/* Active Search & Filter Banner (if any filter is active) */}
          {(searchQuery || selectedCategory !== 'All' || priceRange !== 'all') && (
            <div className="pt-3 border-t border-[#1C2230] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-[#9A9FA9]">
                <span>Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A1F2C] border border-[#C5A880]/40 text-[#C5A880] text-[11px]">
                    Keywords: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-white">✕</button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A1F2C] border border-[#2A3245] text-[#EDE8DF] text-[11px]">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="ml-1.5 hover:text-[#C5A880]">✕</button>
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A1F2C] border border-[#2A3245] text-[#EDE8DF] text-[11px]">
                    {priceRange === 'under-15m' ? '< $15M' : priceRange === '15m-25m' ? '$15M - $25M' : '> $25M'}
                    <button onClick={() => setPriceRange('all')} className="ml-1.5 hover:text-[#C5A880]">✕</button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#C5A880] hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop) => (
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
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-[#0E1117] border border-[#202533] rounded-2xl max-w-lg mx-auto shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#151923] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#EDE8DF] font-light">No properties match your search</h3>
            <p className="text-xs text-[#8A90A0] mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
              {searchQuery ? (
                <>No residences matched <span className="text-[#C5A880] font-medium">"{searchQuery}"</span> with the selected filters.</>
              ) : (
                <>No residences found matching the current category and price criteria.</>
              )}
            </p>

            {/* Suggestions to try */}
            <div className="mb-6 pt-4 border-t border-[#1C2230]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A808E] block mb-2">Try searching for:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Miami', 'Penthouse', 'Pool', 'Waterfront', 'Dubai'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSearchQuery(s);
                      setSelectedCategory('All');
                      setPriceRange('all');
                    }}
                    className="px-3 py-1 rounded bg-[#161A26] border border-[#262C3E] text-xs text-[#C5A880] hover:bg-[#202638] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="reset-filters-btn"
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#C5A880] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase hover:bg-[#d6bc96] transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
