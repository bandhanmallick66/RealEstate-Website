import React, { useState } from 'react';
import { X, PhoneCall, Calendar, Mail, User as UserIcon, CheckCircle2, Shield } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Acquisition Advisory');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div id="consultation-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-[#0F1116] border border-[#222631] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#E0E2E7] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#FFF] border border-[#262B37] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-1">
              REQUEST RECEIVED
            </span>
            <h2 className="font-serif text-2xl text-[#EDE8DF] font-light mb-2">
              Advisory Consultation Scheduled
            </h2>
            <p className="text-xs text-[#8E94A4] font-light max-w-md mx-auto mb-6">
              Thank you, {name}. A senior FORTVÍDE private managing partner will contact you discretely within 2 business hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="py-3 px-8 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-[#C5A880] mb-1">
                <PhoneCall className="w-4 h-4" />
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">
                  PRIVATE DESK
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#EDE8DF] font-light">
                Book a Private Consultation
              </h2>
              <p className="text-xs text-[#8A90A0] mt-1 font-light">
                Direct access to our senior partners for off-market acquisitions, valuation, and confidential portfolio disposal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexandra Vance"
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexandra@vance-holdings.com"
                      className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                    Direct Telephone
                  </label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (305) 555-0198"
                      className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                  Nature of Advisory
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none cursor-pointer"
                >
                  <option value="Acquisition Advisory">Prime Residence Acquisition Advisory</option>
                  <option value="Private Portfolio Listing">Confidential Property Disposal & Listing</option>
                  <option value="Development Plots & Land">Architectural Plot & Land Development</option>
                  <option value="Bespoke Off-Market Sourcing">Bespoke Off-Market Trophy Sourcing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                  Confidential Inquiry / Criteria
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Target cities, budget guidelines, architectural preferences, or specific timeline..."
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] p-3 rounded-lg outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-md active:scale-98"
                >
                  Request Confidential Consultation
                </button>
                <p className="text-[10px] text-[#636979] text-center mt-2 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-[#C5A880] mr-1" />
                  Privileged client communication with mandatory non-disclosure policy.
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
