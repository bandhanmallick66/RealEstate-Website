import React from 'react';
import { ActiveSection } from '../types';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="fortvide-footer" className="bg-[#08090B] border-t border-[#191C24] py-12 text-[#858B99]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-[#15171F]">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 text-[#C5A880]">
                <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" stroke="#C5A880" strokeWidth="1.8" />
                <path d="M20 2V20M36 11L20 20M4 11L20 20" stroke="#C5A880" strokeWidth="1.5" />
                <path d="M20 20V38" stroke="#C5A880" strokeWidth="1.5" />
                <path d="M20 9L29 14.5L20 20L11 14.5L20 9Z" fill="#C5A880" fillOpacity="0.3" />
              </svg>
            </div>
            <div>
              <span className="block font-serif text-lg tracking-[0.2em] font-semibold text-[#EDE8DF] uppercase">
                FORTVÍDE
              </span>
              <span className="block text-[8px] tracking-[0.28em] text-[#C5A880] uppercase">
                LUXURY LIVING, REDEFINED
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs tracking-[0.2em] uppercase font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="text-[#989FAE] hover:text-[#C5A880] transition-colors"
            >
              HOME
            </button>
            <button
              onClick={() => onNavigate('properties')}
              className="text-[#989FAE] hover:text-[#C5A880] transition-colors"
            >
              PROPERTIES
            </button>
            <button
              onClick={() => onNavigate('add-property')}
              className="text-[#989FAE] hover:text-[#C5A880] transition-colors"
            >
              ADD PROPERTY
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#989FAE] hover:text-[#C5A880] transition-colors"
            >
              PROFILE / DASHBOARD
            </button>
          </div>

          {/* Social Icons in circular outlines matching reference */}
          <div className="flex items-center space-x-3">
            {/* Facebook */}
            <a
              href="#facebook"
              aria-label="Facebook"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full border border-[#262A35] flex items-center justify-center text-[#B0B6C5] hover:border-[#C5A880] hover:text-[#C5A880] transition-all text-xs font-serif"
            >
              f
            </a>
            {/* Instagram */}
            <a
              href="#instagram"
              aria-label="Instagram"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full border border-[#262A35] flex items-center justify-center text-[#B0B6C5] hover:border-[#C5A880] hover:text-[#C5A880] transition-all text-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              onClick={(e) => e.preventDefault()}
              className="w-8 h-8 rounded-full border border-[#262A35] flex items-center justify-center text-[#B0B6C5] hover:border-[#C5A880] hover:text-[#C5A880] transition-all text-xs font-semibold"
            >
              in
            </a>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#696F7D] gap-2">
          <p>© {new Date().getFullYear()} FORTVÍDE Luxury Realty International. All rights reserved.</p>
          <p className="flex items-center space-x-4">
            <span>Discretion Guaranteed</span>
            <span>•</span>
            <span>Private Client Network</span>
            <span>•</span>
            <span>Bespoke Global Advisory</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
