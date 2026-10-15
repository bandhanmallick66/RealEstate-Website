import React from 'react';
import { Users, Globe2, Building2, Award, PhoneCall, ArrowRight } from 'lucide-react';

interface StatsBannerProps {
  onOpenConsultation: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ onOpenConsultation }) => {
  return (
    <section id="why-choose-us-section" className="py-16 bg-[#0B0C0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bordered Luxury Card Matching Reference Design */}
        <div className="relative rounded-2xl border border-[#222632] bg-[#0E1015] overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left 4 Cols: Why Choose Us & Narrative */}
            <div className="lg:col-span-4">
              <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-2">
                WHY CHOOSE US
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#EDE8DF] font-light leading-snug">
                A Standard <br /> Above the Rest
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#8D93A2] font-light leading-relaxed">
                We combine global expertise with discrete private advisory and local market insight to deliver unmatched results for our discerning clients.
              </p>
            </div>

            {/* Middle 4 Cols: 2x2 Stats & Script Signature */}
            <div className="lg:col-span-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-x border-[#1F232D] pt-6 lg:pt-0 lg:px-8">
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {/* Stat 1 */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-[#151821] border border-[#232733] text-[#C5A880]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-light text-[#EDE8DF]">500+</span>
                    <span className="block text-[11px] text-[#868C9A] tracking-wider">Happy Clients</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-[#151821] border border-[#232733] text-[#C5A880]">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-light text-[#EDE8DF]">25+</span>
                    <span className="block text-[11px] text-[#868C9A] tracking-wider">Countries Served</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-[#151821] border border-[#232733] text-[#C5A880]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-light text-[#EDE8DF]">1200+</span>
                    <span className="block text-[11px] text-[#868C9A] tracking-wider">Luxury Properties</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-[#151821] border border-[#232733] text-[#C5A880]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-serif text-2xl font-light text-[#EDE8DF]">10+</span>
                    <span className="block text-[11px] text-[#868C9A] tracking-wider">Years of Excellence</span>
                  </div>
                </div>
              </div>

              {/* Handwritten Script Signature Matching Reference */}
              <div className="mt-8 pt-4 border-t border-[#1C2029] text-left">
                <span className="font-script text-3xl sm:text-4xl text-[#C5A880] tracking-wide inline-block transform -rotate-1">
                  Live Exceptionally.
                </span>
              </div>
            </div>

            {/* Right 4 Cols: Lounge Photo + Contact Box */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
              {/* Penthouse Lounge Photo */}
              <div className="relative rounded-lg overflow-hidden h-36 sm:h-40 border border-[#222631]">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                  alt="Private Lounge Overlooking City"
                  className="w-full h-full object-cover filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Speak to Expert & Book Consultation */}
              <div className="bg-[#12151B] p-4 rounded-lg border border-[#222631] space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A1E27] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880]">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#868C9A]">
                      SPEAK TO AN EXPERT
                    </span>
                    <a
                      href="tel:+13055550198"
                      className="block text-xs font-semibold text-[#EDE8DF] hover:text-[#C5A880] transition-colors"
                    >
                      +1 (305) 555-0198
                    </a>
                  </div>
                </div>

                <button
                  id="stats-consultation-btn"
                  onClick={onOpenConsultation}
                  className="w-full py-2.5 px-4 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.14em] uppercase transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95"
                >
                  <span>BOOK CONSULTATION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <p className="text-[10px] text-[#7A808E] text-center">
                  Or email us at <a href="mailto:hello@fortvide.com" className="text-[#A0A5B2] hover:text-[#C5A880] underline">hello@fortvide.com</a>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
