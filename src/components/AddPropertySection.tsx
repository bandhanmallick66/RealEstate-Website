import React, { useState } from 'react';
import { User, PropertyCategory, Property } from '../types';
import { PRESET_IMAGE_OPTIONS } from '../data/seedProperties';
import { PlusCircle, Upload, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles, Building2 } from 'lucide-react';

interface AddPropertySectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onPropertyAdded: (newProperty: Property) => void;
  onNavigateToProperties: () => void;
  onNavigateToDashboard: () => void;
}

export const AddPropertySection: React.FC<AddPropertySectionProps> = ({
  currentUser,
  onOpenAuth,
  onPropertyAdded,
  onNavigateToProperties,
  onNavigateToDashboard
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [beds, setBeds] = useState('5');
  const [baths, setBaths] = useState('6');
  const [sqft, setSqft] = useState('6500');
  const [description, setDescription] = useState('');
  
  // Image handling
  const [imageMode, setImageMode] = useState<'presets' | 'upload' | 'url'>('presets');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_OPTIONS[0].url);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Features
  const defaultAmenities = [
    'Private Heated Infinity Pool',
    'Sommelier Wine Cellar',
    'Smart Home Automation',
    'Direct Waterfront / Skyline View',
    'Private Elevator Access',
    'Dedicated Staff Quarters',
    '24/7 Gated Security'
  ];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Private Heated Infinity Pool',
    'Sommelier Wine Cellar',
    'Smart Home Automation'
  ]);
  const [customFeature, setCustomFeature] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle local file upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedPreview(result);
        setImageUrl(result);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      setErrorMessage('You must be signed in to list a residence.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter the property name/title.');
      return;
    }

    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!numPrice || numPrice <= 0) {
      setErrorMessage('Please enter a valid price in USD.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage('Please provide the property location.');
      return;
    }

    const finalImage = imageUrl || PRESET_IMAGE_OPTIONS[0].url;

    setIsSubmitting(true);

    try {
      const newPropData = {
        title: title.trim(),
        price: numPrice,
        location: location.trim(),
        city: city.trim() || location.split(',')[0]?.trim() || 'Prime Metropolitan',
        country: country.trim() || location.split(',')[1]?.trim() || 'Global',
        category,
        beds: category === 'Plot' ? 0 : parseInt(beds, 10) || 0,
        baths: category === 'Plot' ? 0 : parseInt(baths, 10) || 0,
        sqft: parseInt(sqft, 10) || 5000,
        plotSqft: category === 'Plot' ? parseInt(sqft, 10) : undefined,
        image: finalImage,
        gallery: [
          finalImage,
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
        ],
        description: description.trim() || `An extraordinary ${category.toLowerCase()} situated in a coveted location in ${location}. Built with the finest materials and architectural craftsmanship.`,
        features: selectedFeatures.length > 0 ? selectedFeatures : ['Architectural Masterpiece', 'Panoramic Views'],
        featured: false,
        isExclusive: true,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email
      };

      // Call parent callback which invokes StorageService
      onPropertyAdded(newPropData as any);
      setSubmittedProperty(newPropData as any);
      setIsSubmitting(false);
    } catch {
      setErrorMessage('Failed to save property. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Not logged in view
  if (!currentUser) {
    return (
      <section id="add-property-auth-gate" className="py-20 bg-[#0B0C0E] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-12 bg-[#101319] border border-[#222632] rounded-2xl text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#1A1E27] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880]">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
            EXCLUSIVE SELLERS CIRCLE
          </span>
          <h2 className="font-serif text-2xl text-[#EDE8DF] font-light mb-3">
            Authentication Required
          </h2>
          <p className="text-xs text-[#8F95A5] leading-relaxed mb-6 font-light">
            To maintain our standard of verified ownership, please sign in or register to list your luxury residence for sale.
          </p>
          <button
            id="auth-gate-signin-btn"
            onClick={onOpenAuth}
            className="w-full py-3 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-widest uppercase transition-all shadow-md active:scale-95"
          >
            Sign In / Register to List
          </button>
        </div>
      </section>
    );
  }

  // Success view
  if (submittedProperty) {
    return (
      <section id="add-property-success-view" className="py-20 bg-[#0B0C0E] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 py-10 bg-[#101319] border border-[#C5A880]/40 rounded-2xl text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#18211E] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
            LISTING CONFIRMED
          </span>
          <h2 className="font-serif text-3xl text-[#EDE8DF] font-light mb-2">
            {submittedProperty.title}
          </h2>
          <p className="text-xs text-[#8E94A4] font-light mb-6">
            Your residence has been successfully listed in the FORTVÍDE portfolio and is immediately visible to global collectors.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="view-in-properties-btn"
              onClick={onNavigateToProperties}
              className="flex-1 py-3 px-4 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all"
            >
              Browse in Catalog
            </button>
            <button
              id="view-in-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="flex-1 py-3 px-4 rounded border border-[#2A2E3B] text-[#EDE8DF] hover:border-[#C5A880] hover:text-[#C5A880] text-xs font-medium tracking-wider uppercase transition-all"
            >
              Manage in Dashboard
            </button>
          </div>

          <button
            onClick={() => {
              setSubmittedProperty(null);
              setTitle('');
              setPrice('');
              setLocation('');
              setDescription('');
            }}
            className="mt-6 text-[11px] text-[#A0A5B2] hover:text-[#C5A880] underline block mx-auto"
          >
            + List Another Residence
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="add-property-form-section" className="py-12 sm:py-16 bg-[#0B0C0E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
            SELLERS PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#EDE8DF] font-light">
            List Your Luxury Residence
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8D93A2] font-light">
            Present your property to verified high-net-worth investors and private collectors worldwide.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-[#101319] border border-[#202430] p-6 sm:p-10 rounded-2xl shadow-2xl space-y-8">
          
          {/* Section 1: Property Identity & Category */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#C5A880] mb-4 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              1. Basic Residence Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Property Name / Title *
                </label>
                <input
                  id="add-prop-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Glass Pavilion Estate, Oceanfront Villa"
                  className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['House', 'Apartment', 'Plot'] as PropertyCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium tracking-wider uppercase transition-all ${
                        category === cat
                          ? 'bg-[#C5A880] text-[#0B0C0E] font-semibold'
                          : 'bg-[#151922] text-[#8E94A4] border border-[#262B38] hover:border-[#C5A880]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Asking Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#C5A880] font-semibold">
                    $
                  </span>
                  <input
                    id="add-prop-price"
                    type="number"
                    required
                    min="100000"
                    step="10000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="24,500,000"
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] pl-8 pr-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Location (Region / Address) *
                </label>
                <input
                  id="add-prop-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Miami, Florida or Dubai, UAE"
                  className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                />
              </div>

              {/* City / Country */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Miami"
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-3 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-3 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Property Specifications */}
          <div className="border-t border-[#1C2029] pt-6">
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#C5A880] mb-4">
              2. Dimensions & Specifications
            </h3>

            {category === 'Plot' ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Plot Land Area (Sq Ft) *
                </label>
                <input
                  type="number"
                  required
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  placeholder="45,000"
                  className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Internal Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    min="500"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-5">
              <label className="block text-xs uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Architectural Narrative & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight the architectural pedigree, materials, sightlines, security, and unique lifestyle amenities..."
                className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] p-4 rounded-lg outline-none transition-colors"
              />
            </div>
          </div>

          {/* Section 3: Imagery */}
          <div className="border-t border-[#1C2029] pt-6">
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#C5A880] mb-4 flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-2" />
              3. Residence Visual Presentation
            </h3>

            {/* Selector modes */}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setImageMode('presets')}
                className={`px-3 py-1.5 text-xs rounded uppercase tracking-wider font-medium ${
                  imageMode === 'presets'
                    ? 'bg-[#C5A880] text-[#0B0C0E]'
                    : 'bg-[#151922] text-[#8E94A4] border border-[#262B38]'
                }`}
              >
                Curated Presets
              </button>
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-3 py-1.5 text-xs rounded uppercase tracking-wider font-medium ${
                  imageMode === 'upload'
                    ? 'bg-[#C5A880] text-[#0B0C0E]'
                    : 'bg-[#151922] text-[#8E94A4] border border-[#262B38]'
                }`}
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-3 py-1.5 text-xs rounded uppercase tracking-wider font-medium ${
                  imageMode === 'url'
                    ? 'bg-[#C5A880] text-[#0B0C0E]'
                    : 'bg-[#151922] text-[#8E94A4] border border-[#262B38]'
                }`}
              >
                Direct Image URL
              </button>
            </div>

            {/* Presets Grid */}
            {imageMode === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_IMAGE_OPTIONS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setImageUrl(item.url)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all aspect-video ${
                      imageUrl === item.url ? 'border-[#C5A880] scale-98 shadow-md' : 'border-[#222631] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white px-2 py-0.5 truncate">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload File */}
            {imageMode === 'upload' && (
              <div className="p-6 border-2 border-dashed border-[#2A2E3B] hover:border-[#C5A880]/60 rounded-xl text-center bg-[#151922]">
                <Upload className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                <p className="text-xs text-[#A0A5B2] mb-3">
                  Upload an image from your device (PNG, JPG, WebP)
                </p>
                <input
                  id="add-prop-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-[#8A90A0] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#C5A880] file:text-[#0B0C0E] hover:file:bg-[#d4ba94] cursor-pointer"
                />
                {uploadedPreview && (
                  <div className="mt-4 max-w-xs mx-auto aspect-video rounded-lg overflow-hidden border border-[#C5A880]">
                    <img src={uploadedPreview} alt="Uploaded preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* Direct URL */}
            {imageMode === 'url' && (
              <div className="space-y-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-3 rounded-lg outline-none transition-colors"
                />
                {imageUrl && (
                  <div className="max-w-xs aspect-video rounded-lg overflow-hidden border border-[#222631]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Luxury Amenities */}
          <div className="border-t border-[#1C2029] pt-6">
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#C5A880] mb-3">
              4. Bespoke Amenities & Features
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {defaultAmenities.map((amenity) => {
                const isSelected = selectedFeatures.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleFeature(amenity)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      isSelected
                        ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]'
                        : 'bg-[#151922] text-[#7A808E] border border-[#232733] hover:text-[#C0C4D0]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {amenity}
                  </button>
                );
              })}
            </div>

            {/* Custom amenity input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="Add custom feature (e.g. Private Helipad, Tennis Court)..."
                className="flex-grow bg-[#151922] border border-[#262B38] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-4 py-2 rounded-lg outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-4 py-2 bg-[#202532] text-xs text-[#C5A880] rounded-lg hover:bg-[#2A3040] font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-[#1C2029] pt-6">
            <button
              id="submit-property-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Residence...' : 'Publish Luxury Residence'}</span>
            </button>
            <p className="text-[10px] text-[#6B7280] text-center mt-2.5">
              By listing, you verify that you are the lawful owner or authorized private representative of this residence.
            </p>
          </div>

        </form>

      </div>
    </section>
  );
};
