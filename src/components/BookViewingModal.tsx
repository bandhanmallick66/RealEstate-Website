import React, { useState } from 'react';
import { Property, User, ViewingType, Booking } from '../types';
import { X, Calendar, Clock, MapPin, CheckCircle, Shield, Video, Car } from 'lucide-react';

interface BookViewingModalProps {
  property: Property | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
  onNavigateToDashboard: () => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  property,
  currentUser,
  isOpen,
  onClose,
  onBookingConfirmed,
  onNavigateToDashboard
}) => {
  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState('17:30 (Sunset Terrace & Skyline Hour)');
  const [viewingType, setViewingType] = useState<ViewingType>('in-person');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (305) 555-0198');
  const [notes, setNotes] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const timeSlots = [
    '10:00 AM (Morning Architectural Light)',
    '02:30 PM (Afternoon Interior & Grounds)',
    '05:30 PM (Sunset Terrace & Skyline Hour)',
    '07:30 PM (Twilight & Night Illuminations)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full legal name for security clearance.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBookingData = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        propertyImage: property.image,
        propertyCategory: property.category,
        userId: currentUser?.id || 'guest_client',
        userName: name.trim(),
        userEmail: email.trim(),
        userPhone: phone.trim(),
        date,
        timeSlot,
        viewingType,
        notes: notes.trim()
      };

      onBookingConfirmed(newBookingData as any);
      setConfirmedBooking(newBookingData as any);
      setIsSubmitting(false);
    } catch {
      setError('Booking submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book-viewing-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-[#0F1116] border border-[#222631] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-[#E0E2E7] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#FFF] border border-[#262B37] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedBooking ? (
          /* Confirmation View */
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-7 h-7" />
            </div>

            <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-1">
              PRIVATE VIEWING RESERVED
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#EDE8DF] font-light mb-2">
              Viewing Confirmed
            </h2>
            <p className="text-xs text-[#8E94A4] font-light max-w-md mx-auto mb-6">
              Your appointment for <strong className="text-[#EDE8DF]">{property.title}</strong> has been scheduled. Our private client liaison will reach out to confirm your itinerary.
            </p>

            <div className="bg-[#141720] border border-[#202532] p-4 rounded-xl text-left text-xs space-y-2 mb-6 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#7A808E]">Date:</span>
                <span className="text-[#EDE8DF] font-medium">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A808E]">Time:</span>
                <span className="text-[#EDE8DF] font-medium">{timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A808E]">Format:</span>
                <span className="text-[#C5A880] font-medium">
                  {viewingType === 'in-person' ? 'Private In-Person Tour' : 'Live Virtual Walkthrough'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A808E]">Passcode / Ref:</span>
                <span className="text-[#C5A880] font-mono font-semibold">
                  FV-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDashboard();
                }}
                className="py-3 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
              >
                View in Profile / Dashboard
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded border border-[#262B38] text-[#8E94A4] hover:text-[#EDE8DF] text-xs font-medium uppercase"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold block mb-1">
                PRIVATE RESERVATION
              </span>
              <h2 className="font-serif text-2xl text-[#EDE8DF] font-light">
                Schedule a Private Viewing
              </h2>
              
              {/* Property Summary Pill */}
              <div className="mt-3 flex items-center space-x-3 p-2 rounded-lg bg-[#141720] border border-[#202532]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-12 h-10 rounded object-cover border border-[#262B38]"
                />
                <div>
                  <h4 className="font-serif text-xs font-medium text-[#EDE8DF] truncate max-w-[280px]">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-[10px] text-[#8A90A0]">
                    <MapPin className="w-3 h-3 text-[#C5A880] mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Viewing Format */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-2 font-medium">
                  Viewing Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setViewingType('in-person')}
                    className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                      viewingType === 'in-person'
                        ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#EDE8DF]'
                        : 'border-[#222631] bg-[#141720] text-[#8E94A4] hover:border-[#2C3242]'
                    }`}
                  >
                    <Car className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-medium text-xs text-[#EDE8DF]">In-Person Escort</span>
                      <span className="text-[10px] text-[#7A808E]">Complimentary VIP arrival</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingType('virtual')}
                    className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                      viewingType === 'virtual'
                        ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#EDE8DF]'
                        : 'border-[#222631] bg-[#141720] text-[#8E94A4] hover:border-[#2C3242]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-medium text-xs text-[#EDE8DF]">Live Virtual Walkthrough</span>
                      <span className="text-[10px] text-[#7A808E]">Ultra-HD 1-on-1 stream</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Preferred Date
                  </label>
                  <input
                    id="booking-date-input"
                    type="date"
                    required
                    min={defaultDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Preferred Time Slot
                  </label>
                  <select
                    id="booking-time-select"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-t border-[#1C2029] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexandra Vance"
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexandra@vance-holdings.com"
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Phone / Mobile (with country code)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (305) 555-0198"
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1.5 font-medium">
                    Private Concierge Notes / Security Requests
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Helicopter landing coordination, private yacht berth required, NDA execution..."
                    className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] p-3 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  id="confirm-booking-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-xl active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Appointment...' : 'Confirm Private Viewing'}
                </button>
                <p className="text-[10px] text-[#6B7280] text-center mt-2 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-[#C5A880] mr-1" />
                  All viewing requests handled under strict private client confidentiality.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
