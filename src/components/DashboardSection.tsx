import React, { useState } from 'react';
import { User, Property, Booking } from '../types';
import { 
  Building2, 
  Calendar, 
  Heart, 
  Pencil, 
  Trash2, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  User as UserIcon, 
  PlusCircle, 
  Clock, 
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

interface DashboardSectionProps {
  currentUser: User | null;
  properties: Property[];
  bookings: Booking[];
  favorites: string[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateToAddProperty: () => void;
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onToggleFavorite: (propertyId: string, e: React.MouseEvent) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  currentUser,
  properties,
  bookings,
  favorites,
  onOpenAuth,
  onLogout,
  onNavigateToAddProperty,
  onSelectProperty,
  onEditProperty,
  onDeleteProperty,
  onCancelBooking,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'my-properties' | 'viewings' | 'favorites'>('my-properties');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // If not authenticated, prompt to sign in
  if (!currentUser) {
    return (
      <section id="dashboard-auth-gate" className="py-20 bg-[#0B0C0E] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-12 bg-[#101319] border border-[#222632] rounded-2xl text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#1A1E27] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880]">
            <UserIcon className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
            PRIVATE CLIENT PORTAL
          </span>
          <h2 className="font-serif text-2xl text-[#EDE8DF] font-light mb-3">
            Client Authentication Required
          </h2>
          <p className="text-xs text-[#8F95A5] leading-relaxed mb-6 font-light">
            Sign in to access your listed properties portfolio, review confirmed private viewings, and manage your saved acquisitions.
          </p>
          <button
            id="dashboard-signin-btn"
            onClick={onOpenAuth}
            className="w-full py-3 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-widest uppercase transition-all shadow-md active:scale-95"
          >
            Sign In / Access Portal
          </button>
        </div>
      </section>
    );
  }

  // Properties owned by current user
  const myProperties = properties.filter(p => p.ownerId === currentUser.id);

  // User's viewing bookings
  const myBookings = bookings.filter(b => b.userId === currentUser.id);

  // Favorited properties
  const myFavoriteProperties = properties.filter(p => favorites.includes(p.id));

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section id="dashboard-section" className="py-12 sm:py-16 bg-[#0B0C0E] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="bg-[#101319] border border-[#202430] p-6 sm:p-8 rounded-2xl mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Identity info */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C5A880]/60 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101319]" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#EDE8DF] font-light">
                    {currentUser.name}
                  </h1>
                  <span className="bg-[#C5A880]/15 text-[#C5A880] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded border border-[#C5A880]/30">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-[#8A90A0] mt-1">
                  {currentUser.email} • {currentUser.phone}
                </p>
                <p className="text-[11px] text-[#636979] mt-0.5 font-light">
                  Member since {currentUser.createdAt} • Private Client ID: #{currentUser.id.substring(currentUser.id.length - 6)}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                id="dashboard-add-new-btn"
                onClick={onNavigateToAddProperty}
                className="px-4 py-2.5 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all flex items-center shadow-md"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                List Residence
              </button>
              <button
                id="dashboard-logout-btn"
                onClick={onLogout}
                className="px-4 py-2.5 rounded border border-[#2A2E3B] text-[#8E94A4] hover:text-rose-400 hover:border-rose-400/40 text-xs font-medium tracking-wider uppercase transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-[#1C2029]">
            <div 
              onClick={() => setActiveTab('my-properties')}
              className="p-3 sm:p-4 rounded-xl bg-[#141720] border border-[#202532] cursor-pointer hover:border-[#C5A880]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#8A90A0] mb-1">
                <span>My Listings</span>
                <Building2 className="w-4 h-4 text-[#C5A880]" />
              </div>
              <span className="font-serif text-2xl text-[#EDE8DF] font-light">
                {myProperties.length}
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('viewings')}
              className="p-3 sm:p-4 rounded-xl bg-[#141720] border border-[#202532] cursor-pointer hover:border-[#C5A880]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#8A90A0] mb-1">
                <span>My Viewings</span>
                <Calendar className="w-4 h-4 text-[#C5A880]" />
              </div>
              <span className="font-serif text-2xl text-[#EDE8DF] font-light">
                {myBookings.length}
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('favorites')}
              className="p-3 sm:p-4 rounded-xl bg-[#141720] border border-[#202532] cursor-pointer hover:border-[#C5A880]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#8A90A0] mb-1">
                <span>Saved Estates</span>
                <Heart className="w-4 h-4 text-[#C5A880]" />
              </div>
              <span className="font-serif text-2xl text-[#EDE8DF] font-light">
                {myFavoriteProperties.length}
              </span>
            </div>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex space-x-2 border-b border-[#1C2029] mb-8">
          <button
            id="tab-my-properties"
            onClick={() => setActiveTab('my-properties')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors relative flex items-center ${
              activeTab === 'my-properties'
                ? 'text-[#C5A880]'
                : 'text-[#858C9C] hover:text-[#EDE8DF]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 mr-2" />
            Manage My Properties ({myProperties.length})
            {activeTab === 'my-properties' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />
            )}
          </button>

          <button
            id="tab-viewings"
            onClick={() => setActiveTab('viewings')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors relative flex items-center ${
              activeTab === 'viewings'
                ? 'text-[#C5A880]'
                : 'text-[#858C9C] hover:text-[#EDE8DF]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Scheduled Viewings ({myBookings.length})
            {activeTab === 'viewings' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />
            )}
          </button>

          <button
            id="tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors relative flex items-center ${
              activeTab === 'favorites'
                ? 'text-[#C5A880]'
                : 'text-[#858C9C] hover:text-[#EDE8DF]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 mr-2" />
            Saved Residences ({myFavoriteProperties.length})
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />
            )}
          </button>
        </div>

        {/* TAB 1: MANAGE MY PROPERTIES */}
        {activeTab === 'my-properties' && (
          <div className="space-y-4">
            {myProperties.length > 0 ? (
              myProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#101319] border border-[#202430] hover:border-[#2C3242] p-4 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center space-x-4 cursor-pointer flex-grow" onClick={() => onSelectProperty(prop)}>
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-24 h-20 sm:w-32 sm:h-24 rounded-lg object-cover border border-[#232733] shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-semibold bg-[#C5A880]/10 px-2 py-0.5 rounded border border-[#C5A880]/30">
                          {prop.category}
                        </span>
                        {prop.featured && (
                          <span className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-serif text-lg text-[#EDE8DF] hover:text-[#C5A880] transition-colors mt-1 font-medium">
                        {prop.title}
                      </h3>
                      
                      <div className="flex items-center text-xs text-[#8A90A0] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C5A880] mr-1" />
                        <span>{prop.location}</span>
                        <span className="mx-2">•</span>
                        <span>{prop.sqft.toLocaleString()} Sq Ft</span>
                        {prop.category !== 'Plot' && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{prop.beds} Beds / {prop.baths} Baths</span>
                          </>
                        )}
                      </div>

                      <div className="text-sm font-semibold font-serif text-[#C5A880] mt-1.5">
                        {formatPrice(prop.price)}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons: Edit & Delete */}
                  <div className="flex items-center space-x-2 border-t md:border-t-0 pt-3 md:pt-0 border-[#1C2029]">
                    <button
                      id={`edit-property-${prop.id}`}
                      onClick={() => onEditProperty(prop)}
                      className="px-3.5 py-2 rounded bg-[#181C25] hover:bg-[#202532] border border-[#2C3140] hover:border-[#C5A880]/60 text-xs font-medium text-[#EDE8DF] flex items-center transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5 text-[#C5A880]" />
                      Edit Property
                    </button>

                    {deleteConfirmId === prop.id ? (
                      <div className="flex items-center space-x-1.5 bg-rose-950/40 p-1 rounded border border-rose-500/40">
                        <span className="text-[10px] text-rose-300 px-1 font-medium">Confirm?</span>
                        <button
                          id={`confirm-delete-${prop.id}`}
                          onClick={() => {
                            onDeleteProperty(prop.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-700"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-[#202532] text-xs text-[#8E94A4] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`delete-property-${prop.id}`}
                        onClick={() => setDeleteConfirmId(prop.id)}
                        className="px-3 py-2 rounded bg-[#181C25] hover:bg-rose-950/30 border border-[#2C3140] hover:border-rose-500/40 text-xs font-medium text-[#8A90A0] hover:text-rose-400 flex items-center transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#101319] border border-[#202430] p-10 rounded-xl text-center">
                <Building2 className="w-10 h-10 text-[#C5A880]/50 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#EDE8DF] font-light">No properties listed yet</h3>
                <p className="text-xs text-[#858C9C] mt-1 mb-5">
                  Have a premier estate, apartment, or development plot you wish to present to buyers?
                </p>
                <button
                  onClick={onNavigateToAddProperty}
                  className="px-5 py-2.5 rounded bg-[#C5A880] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase hover:bg-[#d6bc96] transition-all"
                >
                  List a Residence for Sale
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULED VIEWINGS */}
        {activeTab === 'viewings' && (
          <div className="space-y-4">
            {myBookings.length > 0 ? (
              myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#101319] border border-[#202430] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={b.propertyImage}
                      alt={b.propertyTitle}
                      className="w-20 h-16 rounded-lg object-cover border border-[#232733]"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                          b.status === 'Confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-[#C5A880] font-sans">
                          {b.viewingType === 'in-person' ? 'Private In-Person Tour' : 'Live Virtual Walkthrough'}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-base text-[#EDE8DF] font-medium mt-1">
                        {b.propertyTitle}
                      </h3>
                      
                      <p className="text-xs text-[#8E94A4] flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C5A880] mr-1" />
                        <span>{b.propertyLocation}</span>
                      </p>

                      <div className="flex items-center text-xs text-[#EDE8DF] font-medium mt-1 space-x-4">
                        <span className="flex items-center text-[#C5A880]">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {b.date}
                        </span>
                        <span className="flex items-center text-[#A0A5B2]">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {b.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 border-t md:border-t-0 pt-3 md:pt-0 border-[#1C2029]">
                    {b.status === 'Confirmed' ? (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-3 py-1.5 rounded border border-rose-500/30 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
                      >
                        Cancel Viewing
                      </button>
                    ) : (
                      <span className="text-xs text-[#7A808E] italic">Viewing Cancelled</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#101319] border border-[#202430] p-10 rounded-xl text-center">
                <Calendar className="w-10 h-10 text-[#C5A880]/50 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#EDE8DF] font-light">No viewings scheduled</h3>
                <p className="text-xs text-[#858C9C] mt-1 mb-5">
                  Browse our collection to book a private VIP escort or live virtual walkthrough.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFavoriteProperties.length > 0 ? (
              myFavoriteProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#101319] border border-[#202430] rounded-xl overflow-hidden p-4 flex flex-col justify-between"
                >
                  <div className="cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => onToggleFavorite(prop.id, e)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-[#C5A880]"
                      >
                        <Heart className="w-4 h-4 fill-[#C5A880]" />
                      </button>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-semibold">{prop.category}</span>
                    <h3 className="font-serif text-base text-[#EDE8DF] font-medium">{prop.title}</h3>
                    <p className="text-xs text-[#8A90A0]">{prop.location}</p>
                    <p className="font-serif text-sm font-semibold text-[#C5A880] mt-2">{formatPrice(prop.price)}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C2029] flex justify-between items-center">
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="text-xs text-[#C5A880] hover:underline flex items-center font-medium"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-[#101319] border border-[#202430] p-10 rounded-xl text-center">
                <Heart className="w-10 h-10 text-[#C5A880]/50 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#EDE8DF] font-light">No saved residences</h3>
                <p className="text-xs text-[#858C9C] mt-1">
                  Click the heart icon on any property card to save it for quick access.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
