import React, { useState, useEffect } from 'react';
import { Property, User, ActiveSection, Booking } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { FeaturedSelection } from './components/FeaturedSelection';
import { PropertiesSection } from './components/PropertiesSection';
import { ServicesRow } from './components/ServicesRow';
import { StatsBanner } from './components/StatsBanner';
import { AddPropertySection } from './components/AddPropertySection';
import { DashboardSection } from './components/DashboardSection';
import { Footer } from './components/Footer';

// Modals
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { BookViewingModal } from './components/BookViewingModal';
import { EditPropertyModal } from './components/EditPropertyModal';
import { AuthModal } from './components/AuthModal';
import { ConsultationModal } from './components/ConsultationModal';
import { VideoModal } from './components/VideoModal';
import { LiveInquiryChat } from './components/LiveInquiryChat';

import { ArrowRight, Play, ChevronDown, Compass, Shield, Award, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [chatProperty, setChatProperty] = useState<Property | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Visual Theme State (Dark Noir vs. Soft Cream & Charcoal Light Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('fortvide_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('fortvide_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load initial data and bind custom events for reactive storage sync
  useEffect(() => {
    const syncData = () => {
      setProperties(StorageService.getProperties());
      setCurrentUser(StorageService.getCurrentUser());
      setBookings(StorageService.getBookings());
      setFavorites(StorageService.getFavorites());
    };

    syncData();

    window.addEventListener('fortvide_properties_changed', syncData);
    window.addEventListener('fortvide_auth_changed', syncData);
    window.addEventListener('fortvide_bookings_changed', syncData);
    window.addEventListener('fortvide_favorites_changed', syncData);

    return () => {
      window.removeEventListener('fortvide_properties_changed', syncData);
      window.removeEventListener('fortvide_auth_changed', syncData);
      window.removeEventListener('fortvide_bookings_changed', syncData);
      window.removeEventListener('fortvide_favorites_changed', syncData);
    };
  }, []);

  // Handlers
  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterMarketplace = () => {
    setActiveSection('properties');
    const marketplaceElement = document.getElementById('marketplace-anchor');
    if (marketplaceElement) {
      marketplaceElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenPropertyDetail = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleOpenAgentChat = (property: Property) => {
    setChatProperty(property);
    setIsChatOpen(true);
  };

  const handleOpenBookViewing = (property: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookingProperty(property);
    setIsBookingModalOpen(true);
  };

  const handleToggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleFavorite(propertyId);
  };

  const handleLogout = () => {
    StorageService.logoutUser();
  };

  const handlePropertyAdded = (newProperty: Property) => {
    StorageService.addProperty(newProperty);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleSavePropertyEdit = (updatedProperty: Property) => {
    StorageService.updateProperty(updatedProperty.id, updatedProperty);
    setIsEditModalOpen(false);
    setEditingProperty(null);
  };

  const handleDeleteProperty = (propertyId: string) => {
    StorageService.deleteProperty(propertyId);
  };

  const handleCancelBooking = (bookingId: string) => {
    StorageService.cancelBooking(bookingId);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings(StorageService.getBookings());
  };

  return (
    <div className={`min-h-screen bg-[#07080A] text-[#EDE8DF] selection:bg-[#C5A880]/30 selection:text-white font-sans flex flex-col transition-colors duration-300 ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Areas with Framer Motion Entrance Transitions */}
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          {/* VIEW 1: HOME VIEW WITH FULL-SCREEN HERO */}
          {activeSection === 'home' && (
            <motion.div
              key="home-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* FULL-SCREEN HERO SECTION */}
              <section
                id="fullscreen-hero"
                className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-[#07080A]"
              >
                {/* Cinematic Luxury Dusk Architectural Backdrop */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2600&q=85"
                    alt="Fortvíde Architectural Residence Dusk View"
                    className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] scale-[1.02] transform transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Noir Vignettes & Radial Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#0B0C0E]/60 to-[#07080A]/85" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#07080A]/95 via-[#0B0C0E]/70 to-[#07080A]/50" />
                  
                  {/* Subtle Luxury Gold Ambient Glow */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />
                </div>

                {/* Center Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center py-12 lg:py-16">
                  <div className="max-w-4xl mx-auto text-center space-y-6">
                    
                    {/* Eyebrow with Fortvíde Seal Badge */}
                    <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#12151B]/80 border border-[#C5A880]/30 backdrop-blur-md shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                      <span className="text-[10px] sm:text-xs tracking-[0.28em] font-medium uppercase text-[#C5A880]">
                        CURATED PRIVATE CLIENT PORTFOLIO
                      </span>
                      <Sparkles className="w-3 h-3 text-[#C5A880]" />
                    </div>

                    {/* Elegant Typographic Lockup for 'Fortvíde' & Luxury Heading */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C5A880]/70" />
                        <span className="font-serif tracking-[0.35em] text-sm sm:text-base font-semibold text-[#DFBA73] uppercase">
                          PRIVATE RESIDENCES & ESTATES
                        </span>
                        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C5A880]/70" />
                      </div>

                      <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-[#EDE8DF] tracking-tight uppercase leading-[0.98]">
                        FORTVÍDE <br />
                        <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F8EDD3] via-[#DFBA73] to-[#B89666]">
                          LUXURY LIVING
                        </span>
                      </h1>

                      <p className="mt-6 text-sm sm:text-base lg:text-lg text-[#A6ACB8] max-w-2xl mx-auto font-light leading-relaxed">
                        Handpicked residences, cliffside sanctuaries, and sky-high penthouses for those who command the extraordinary. Discretion guaranteed.
                      </p>
                    </div>

                    {/* Primary & Secondary Call-to-Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      {/* ENTER THE MARKETPLACE CTA BUTTON */}
                      <button
                        id="enter-marketplace-btn"
                        onClick={handleEnterMarketplace}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D6BA91] via-[#C5A880] to-[#B39364] text-[#07080A] font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(197,168,128,0.35)] hover:shadow-[0_0_35px_rgba(197,168,128,0.55)] hover:scale-105 active:scale-95 group"
                      >
                        <Compass className="w-4 h-4 text-[#07080A] group-hover:rotate-45 transition-transform duration-300" />
                        <span>ENTER THE MARKETPLACE</span>
                        <ArrowRight className="w-4 h-4 text-[#07080A] group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* WATCH CINEMATIC EXPERIENCE */}
                      <button
                        id="hero-video-btn"
                        onClick={() => setIsVideoModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-7 py-4 rounded-full bg-[#12151C]/90 hover:bg-[#1A1F29] border border-[#C5A880]/40 hover:border-[#C5A880] text-[#EDE8DF] text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 backdrop-blur-md group active:scale-95"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#C5A880]/20 flex items-center justify-center group-hover:bg-[#C5A880] transition-colors">
                          <Play className="w-3 h-3 text-[#C5A880] group-hover:text-[#0B0C0E] ml-0.5 fill-current transition-colors" />
                        </div>
                        <span>WATCH CINEMATIC FILM</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Bottom Noir & Gold Metrics Band */}
                <div className="relative z-10 border-t border-[#1C2029]/80 bg-[#07080A]/85 backdrop-blur-md py-4">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-2 border-r border-[#1C2029] last:border-0 md:border-r">
                        <span className="block font-serif text-xl sm:text-2xl text-[#EDE8DF] font-light tracking-wide">
                          $480M+
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                          Active Inventory
                        </span>
                      </div>

                      <div className="p-2 border-r border-[#1C2029] md:border-r">
                        <span className="block font-serif text-xl sm:text-2xl text-[#EDE8DF] font-light tracking-wide">
                          18
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                          Global Metropolises
                        </span>
                      </div>

                      <div className="p-2 border-r border-[#1C2029] md:border-r">
                        <span className="block font-serif text-xl sm:text-2xl text-[#EDE8DF] font-light tracking-wide">
                          100%
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                          Confidentiality
                        </span>
                      </div>

                      <div className="p-2">
                        <span className="block font-serif text-xl sm:text-2xl text-[#EDE8DF] font-light tracking-wide">
                          VIP Escort
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                          Private Viewings
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Scroll Down Prompt */}
                  <div className="text-center pt-2">
                    <button
                      onClick={handleEnterMarketplace}
                      className="inline-flex flex-col items-center text-[10px] uppercase tracking-[0.25em] text-[#7E8594] hover:text-[#C5A880] transition-colors"
                    >
                      <span>Scroll to explore</span>
                      <ChevronDown className="w-3.5 h-3.5 animate-bounce mt-0.5 text-[#C5A880]" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SERVICES HIGHLIGHT ROW */}
              <ServicesRow />

              {/* FEATURED SELECTION */}
              <FeaturedSelection
                properties={properties}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectProperty={handleOpenPropertyDetail}
                onBookViewing={handleOpenBookViewing}
                onViewAll={() => handleNavigate('properties')}
                currentUserId={currentUser?.id}
              />

              {/* STATS & WHY CHOOSE US BANNER */}
              <StatsBanner onOpenConsultation={() => setIsConsultationModalOpen(true)} />
            </motion.div>
          )}

          {/* VIEW 2: PROPERTIES MARKETPLACE CATALOG */}
          {activeSection === 'properties' && (
            <motion.div
              key="properties-section"
              id="marketplace-anchor"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <PropertiesSection
                properties={properties}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectProperty={handleOpenPropertyDetail}
                onBookViewing={handleOpenBookViewing}
                currentUserId={currentUser?.id}
              />
            </motion.div>
          )}

          {/* VIEW 3: ADD PROPERTY FOR SALE */}
          {activeSection === 'add-property' && (
            <motion.div
              key="add-property-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AddPropertySection
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onPropertyAdded={handlePropertyAdded}
                onNavigateToProperties={() => handleNavigate('properties')}
                onNavigateToDashboard={() => handleNavigate('dashboard')}
              />
            </motion.div>
          )}

          {/* VIEW 4: CLIENT DASHBOARD & PROFILE */}
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardSection
                currentUser={currentUser}
                properties={properties}
                bookings={bookings}
                favorites={favorites}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                onNavigateToAddProperty={() => handleNavigate('add-property')}
                onSelectProperty={handleOpenPropertyDetail}
                onEditProperty={handleEditProperty}
                onDeleteProperty={handleDeleteProperty}
                onCancelBooking={handleCancelBooking}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* MODAL 1: PROPERTY DETAIL MODAL */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProperty(null);
        }}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onBookViewing={(prop) => {
          setIsDetailModalOpen(false);
          handleOpenBookViewing(prop);
        }}
        onOpenAgentChat={(prop) => {
          handleOpenAgentChat(prop);
        }}
        isOwner={currentUser && selectedProperty ? currentUser.id === selectedProperty.ownerId : false}
      />

      {/* MODAL 2: BOOK VIEWING MODAL */}
      <BookViewingModal
        property={bookingProperty}
        currentUser={currentUser}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingProperty(null);
        }}
        onBookingConfirmed={handleBookingConfirmed}
        onNavigateToDashboard={() => {
          setIsBookingModalOpen(false);
          handleNavigate('dashboard');
        }}
      />

      {/* MODAL 3: EDIT PROPERTY MODAL */}
      <EditPropertyModal
        property={editingProperty}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSavePropertyEdit}
      />

      {/* MODAL 4: AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* MODAL 5: CONSULTATION MODAL */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* MODAL 6: VIDEO CINEMATIC MODAL */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onExploreProperties={() => {
          setIsVideoModalOpen(false);
          handleNavigate('properties');
        }}
      />

      {/* MODAL 7: LIVE INQUIRY CHAT WITH LISTING AGENT */}
      <LiveInquiryChat
        property={chatProperty}
        currentUser={currentUser}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenBookViewing={(prop) => {
          setIsChatOpen(false);
          handleOpenBookViewing(prop);
        }}
        onOpenConsultation={() => {
          setIsChatOpen(false);
          setIsConsultationModalOpen(true);
        }}
      />

      {/* Floating Concierge / Live Inquiry Launcher */}
      {!isChatOpen && (
        <button
          id="floating-live-inquiry-btn"
          onClick={() => {
            const targetProp = chatProperty || selectedProperty || properties[0];
            if (targetProp) {
              setChatProperty(targetProp);
              setIsChatOpen(true);
            }
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#10131B]/95 hover:bg-[#181D29] border border-[#C5A880]/60 hover:border-[#C5A880] text-[#EDE8DF] shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_20px_rgba(197,168,128,0.25)] flex items-center space-x-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-wider uppercase font-sans">
            Inquire with Agent
          </span>
        </button>
      )}
    </div>
  );
}
