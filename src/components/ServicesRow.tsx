import React from 'react';
import { Gem, Glasses, Building, ShieldCheck } from 'lucide-react';

export const ServicesRow: React.FC = () => {
  const services = [
    {
      icon: <Gem className="w-6 h-6 text-[#C5A880]" />,
      title: 'Luxury Properties',
      description: "Curated selection of the world's finest homes."
    },
    {
      icon: <Glasses className="w-6 h-6 text-[#C5A880]" />,
      title: 'Virtual Tours',
      description: 'Experience properties from anywhere in ultra-high fidelity.'
    },
    {
      icon: <Building className="w-6 h-6 text-[#C5A880]" />,
      title: 'Personal Concierge',
      description: 'Dedicated support for a seamless acquisition journey.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C5A880]" />,
      title: 'Secure Transactions',
      description: 'Your privacy, escrow security, and safety come first.'
    }
  ];

  return (
    <section id="services-section" className="py-14 bg-[#0B0C0E] border-y border-[#181B22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="mb-10 text-left">
          <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-1">
            EXCLUSIVE SERVICES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#EDE8DF] font-light">
            Tailored for Extraordinary Living
          </h2>
        </div>

        {/* 4 Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-2 group hover:translate-y-[-2px] transition-transform"
            >
              <div className="mb-4 p-3 rounded-lg bg-[#14171E] border border-[#232733] group-hover:border-[#C5A880]/50 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-sans text-sm font-semibold text-[#EDE8DF] tracking-wide mb-1.5 group-hover:text-[#C5A880] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#8B91A0] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
