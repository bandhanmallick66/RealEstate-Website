import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onWatchVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onWatchVideo }) => {
  return (
    <section id="hero-section" className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Luxury Dusk Penthouse */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2200&q=85"
          alt="Luxury Penthouse Sunset Skyline"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Gradients to match the dark aesthetic in reference image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-[#0B0C0E]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/90 via-[#0B0C0E]/40 to-transparent" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col justify-between min-h-[85vh] lg:min-h-[92vh]">
        
        {/* Top/Center Text Content */}
        <div className="max-w-2xl mt-12 sm:mt-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="w-6 h-[1px] bg-[#C5A880]" />
            <span className="text-[11px] sm:text-xs tracking-[0.25em] font-medium uppercase text-[#C5A880]">
              EXCLUSIVE PROPERTIES
            </span>
          </div>

          {/* Stately Display Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#EDE8DF] tracking-tight leading-[1.05] uppercase">
            LUXURY <br />
            BEYOND <br />
            <span className="italic font-normal text-[#C5A880]">EXPECTATIONS</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-[#A8AEBC] max-w-lg font-light leading-relaxed">
            Handpicked residences for those who expect more from life. Curating architectural masterpieces across the globe’s most coveted destinations.
          </p>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 flex items-center space-x-4">
            <button
              id="hero-explore-btn"
              onClick={onExplore}
              className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-full border border-[#C5A880] text-[#EDE8DF] hover:text-[#0B0C0E] hover:bg-[#C5A880] transition-all duration-300 text-xs tracking-[0.18em] uppercase font-medium group active:scale-95 shadow-lg"
            >
              <span>EXPLORE PROPERTIES</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:text-[#0B0C0E] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Bottom Right: Watch Full Video / Discover the Experience */}
        <div className="self-end pb-8 sm:pb-12">
          <button
            id="hero-video-trigger"
            onClick={onWatchVideo}
            className="flex items-center space-x-4 group p-2 pr-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#C5A880]/50 transition-all hover:bg-black/60"
          >
            <div className="w-11 h-11 rounded-full bg-[#181C24] border border-[#C5A880]/60 flex items-center justify-center group-hover:bg-[#C5A880] transition-all shadow-md group-hover:scale-105">
              <Play className="w-4 h-4 text-[#C5A880] group-hover:text-[#0B0C0E] ml-0.5 fill-current transition-colors" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-[#EDE8DF] group-hover:text-[#C5A880] transition-colors">
                WATCH FULL VIDEO
              </span>
              <span className="block text-[9px] tracking-wider uppercase text-[#888E9C]">
                DISCOVER THE EXPERIENCE
              </span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
