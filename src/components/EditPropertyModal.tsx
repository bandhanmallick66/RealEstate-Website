import React, { useState, useEffect } from 'react';
import { Property, PropertyCategory } from '../types';
import { PRESET_IMAGE_OPTIONS } from '../data/seedProperties';
import { X, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [beds, setBeds] = useState('0');
  const [baths, setBaths] = useState('0');
  const [sqft, setSqft] = useState('0');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setCategory(property.category);
      setPrice(property.price.toString());
      setLocation(property.location);
      setCity(property.city || '');
      setCountry(property.country || '');
      setBeds(property.beds.toString());
      setBaths(property.baths.toString());
      setSqft(property.sqft.toString());
      setDescription(property.description);
      setImageUrl(property.image);
      setError('');
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a property title.');
      return;
    }

    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!numPrice || numPrice <= 0) {
      setError('Please enter a valid price in USD.');
      return;
    }

    if (!location.trim()) {
      setError('Please provide the property location.');
      return;
    }

    const updatedData: Property = {
      ...property,
      title: title.trim(),
      category,
      price: numPrice,
      location: location.trim(),
      city: city.trim() || property.city,
      country: country.trim() || property.country,
      beds: category === 'Plot' ? 0 : parseInt(beds, 10) || 0,
      baths: category === 'Plot' ? 0 : parseInt(baths, 10) || 0,
      sqft: parseInt(sqft, 10) || property.sqft,
      plotSqft: category === 'Plot' ? parseInt(sqft, 10) : undefined,
      description: description.trim(),
      image: imageUrl || property.image,
      gallery: [imageUrl || property.image, ...(property.gallery?.slice(1) || [])]
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <div id="edit-property-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-[#0F1116] border border-[#222631] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-[#E0E2E7] my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#FFF] border border-[#262B37] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-1">
            MANAGE RESIDENCE
          </span>
          <h2 className="font-serif text-2xl text-[#EDE8DF] font-light">
            Edit Residence Listing
          </h2>
          <p className="text-xs text-[#8A90A0] mt-0.5">
            Update pricing, specifications, or presentation. Changes reflect automatically across the marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
              Property Name / Title
            </label>
            <input
              id="edit-prop-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3.5 py-2.5 rounded-lg outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none cursor-pointer"
              >
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Offering Price (USD)
              </label>
              <input
                id="edit-prop-price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Specs */}
          {category !== 'Plot' ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                  Area (Sq Ft)
                </label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2 rounded-lg outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                Plot Land Area (Sq Ft)
              </label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2 rounded-lg outline-none"
              />
            </div>
          )}

          {/* Image URL & Quick Preset selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#C5A880]" />
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2 rounded-lg outline-none mb-2"
            />
            {/* Quick preset thumbnail pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGE_OPTIONS.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className="text-[10px] text-[#A0A5B2] hover:text-[#C5A880] bg-[#161922] px-2 py-1 rounded border border-[#232733] whitespace-nowrap"
                >
                  Preset {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
              Architectural Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] p-3 rounded-lg outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              id="save-edit-property-btn"
              type="submit"
              className="flex-1 py-3 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded border border-[#262B38] text-[#8E94A4] hover:text-[#EDE8DF] text-xs font-medium uppercase"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
