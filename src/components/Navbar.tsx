import React, { useState } from 'react';
import { ActiveSection, User } from '../types';
import { UserCheck, LogOut, Menu, X, PlusCircle, LayoutDashboard, Building2, Home, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenConsultation: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenConsultation,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: ActiveSection; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'HOME', icon: <Home className="w-3.5 h-3.5 mr-1" /> },
    { id: 'properties', label: 'PROPERTIES', icon: <Building2 className="w-3.5 h-3.5 mr-1" /> },
    { id: 'add-property', label: 'ADD PROPERTY', icon: <PlusCircle className="w-3.5 h-3.5 mr-1" /> },
    { id: 'dashboard', label: 'PROFILE / DASHBOARD', icon: <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> },
  ];

  return (
    <nav id="fortvide-navbar" className="sticky top-0 z-40 bg-[#0B0C0E]/90 backdrop-blur-md border-b border-[#1E222B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            {/* Geometric Gold Isometric Cube Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg 
                viewBox="0 0 40 40" 
                fill="none" 
                className="w-8 h-8 text-[#C5A880] transition-transform duration-300 group-hover:scale-105"
              >
                <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" stroke="#C5A880" strokeWidth="1.8" />
                <path d="M20 2V20M36 11L20 20M4 11L20 20" stroke="#C5A880" strokeWidth="1.5" />
                <path d="M20 20V38" stroke="#C5A880" strokeWidth="1.5" />
                <path d="M20 9L29 14.5L20 20L11 14.5L20 9Z" fill="#C5A880" fillOpacity="0.25" />
              </svg>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl tracking-[0.18em] font-semibold text-[#EDE8DF] uppercase leading-none">
                FORTVÍDE
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.28em] text-[#C5A880] uppercase mt-1 font-sans font-medium">
                LUXURY LIVING, REDEFINED
              </span>
            </div>
          </button>

          {/* Desktop 4-Section Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`text-xs tracking-[0.2em] font-medium transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#C5A880]' 
                      : 'text-[#A0A5B2] hover:text-[#EDE8DF]'
                  }`}
                >
                  <span className="flex items-center">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880] rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Book Consultation & User Profile & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === 'light' ? 'Switch to Noir & Gold (Dark Mode)' : 'Switch to Soft Cream & Charcoal (Light Mode)'}
              aria-label="Toggle theme between Noir and Cream"
              className="p-2.5 rounded-full border border-[#2A2E39] bg-[#12151B] hover:border-[#C5A880]/60 text-[#EDE8DF] hover:text-[#C5A880] transition-all duration-300 flex items-center justify-center group shadow-sm active:scale-95"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#8C6730] group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Sun className="w-4 h-4 text-[#C5A880] group-hover:rotate-45 transition-transform duration-300" />
              )}
            </button>

            <button
              id="nav-consultation-btn"
              onClick={onOpenConsultation}
              className="bg-[#C5A880] text-[#0B0C0E] hover:bg-[#d6bc96] text-xs font-semibold tracking-[0.12em] uppercase px-5 py-2.5 rounded-sm transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(197,168,128,0.3)] active:scale-95"
            >
              BOOK CONSULTATION
            </button>

            {/* User Auth Info / Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-sm border border-[#2A2E39] bg-[#12151B] hover:border-[#C5A880]/50 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A880]/40"
                  />
                  <span className="text-xs text-[#E0E2E7] font-medium max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-[#12151B] border border-[#2A2E39] shadow-2xl rounded-sm py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#1E222B]">
                      <p className="text-xs font-semibold text-[#EDE8DF]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#8E95A5] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider text-[#C5A880] font-semibold">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      id="dropdown-dashboard-btn"
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#C0C4D0] hover:text-[#C5A880] hover:bg-[#181C24] flex items-center"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                      Manage My Properties
                    </button>

                    <button
                      id="dropdown-add-prop-btn"
                      onClick={() => {
                        onNavigate('add-property');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#C0C4D0] hover:text-[#C5A880] hover:bg-[#181C24] flex items-center"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-2" />
                      List New Residence
                    </button>

                    <div className="border-t border-[#1E222B] my-1" />

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-[#181C24] flex items-center"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={onOpenAuth}
                className="flex items-center text-xs tracking-wider uppercase text-[#C5A880] hover:text-[#FFF] border border-[#C5A880]/40 hover:border-[#C5A880] px-4 py-2 rounded-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                SIGN IN
              </button>
            )}
          </div>

          {/* Mobile Menu & Theme Buttons */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              id="mobile-header-theme-toggle"
              onClick={onToggleTheme}
              title={theme === 'light' ? 'Switch to Noir & Gold' : 'Switch to Cream & Charcoal'}
              aria-label="Toggle visual theme"
              className="p-2 rounded-full border border-[#2A2E39] bg-[#12151B] text-[#EDE8DF] hover:text-[#C5A880] transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#8C6730]" />
              ) : (
                <Sun className="w-4 h-4 text-[#C5A880]" />
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#C0C4D0] hover:text-[#C5A880] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-[#0F1116] border-b border-[#222630] px-4 pt-3 pb-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded text-xs tracking-[0.2em] uppercase font-medium flex items-center ${
                activeSection === item.id 
                  ? 'bg-[#181B22] text-[#C5A880]' 
                  : 'text-[#9A9FA9] hover:text-[#FFF]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#1E222B] flex flex-col gap-2">
            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center justify-between py-1.5 px-1">
              <span className="text-xs text-[#9A9FA9] uppercase tracking-wider font-medium">Palette Variant</span>
              <button
                id="mobile-drawer-theme-toggle"
                onClick={onToggleTheme}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#2A2E39] bg-[#12151B] text-xs text-[#EDE8DF]"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#8C6730]" />
                    <span className="text-[#8C6730] font-medium">Cream & Charcoal</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="text-[#C5A880] font-medium">Noir & Gold</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#C5A880] text-[#0B0C0E] py-2.5 text-xs font-semibold tracking-wider uppercase text-center rounded-sm"
            >
              BOOK CONSULTATION
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between pt-2 px-1">
                <span className="text-xs text-[#C5A880] font-medium">{currentUser.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 flex items-center"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full border border-[#C5A880] text-[#C5A880] py-2 text-xs font-medium tracking-wider uppercase rounded-sm text-center"
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
