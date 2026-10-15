import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<User['role']>('VIP Member');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signInEmail.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      const user = StorageService.loginUser(signInEmail.trim());
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    } catch {
      setError('Authentication failed. Please verify your credentials.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signUpName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      const user = StorageService.registerUser(
        signUpName.trim(),
        signUpEmail.trim(),
        signUpPhone.trim(),
        signUpRole
      );
      onAuthSuccess(user);
      onClose();
    } catch {
      setError('Registration could not be completed. Please try again.');
    }
  };

  // Demo user quick login
  const handleQuickDemoLogin = (email: string) => {
    const user = StorageService.loginUser(email);
    if (user) {
      onAuthSuccess(user);
      onClose();
    }
  };

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-[#0F1116] border border-[#222631] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-[#E0E2E7] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#181C24] hover:bg-[#222733] text-[#A0A5B2] hover:text-[#FFF] border border-[#262B37] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 text-[#C5A880]">
              <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" stroke="#C5A880" strokeWidth="1.8" />
              <path d="M20 2V20M36 11L20 20M4 11L20 20" stroke="#C5A880" strokeWidth="1.5" />
              <path d="M20 20V38" stroke="#C5A880" strokeWidth="1.5" />
              <path d="M20 9L29 14.5L20 20L11 14.5L20 9Z" fill="#C5A880" fillOpacity="0.25" />
            </svg>
          </div>
          <span className="font-serif text-xl tracking-[0.2em] font-semibold text-[#EDE8DF] uppercase block">
            FORTVÍDE
          </span>
          <span className="text-[8px] tracking-[0.28em] text-[#C5A880] uppercase">
            PRIVATE CLIENT PORTAL
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-[#141720] p-1 border border-[#202532] mb-6">
          <button
            id="auth-tab-signin"
            type="button"
            onClick={() => {
              setTab('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all ${
              tab === 'signin'
                ? 'bg-[#C5A880] text-[#0B0C0E] shadow-sm'
                : 'text-[#8A90A0] hover:text-[#EDE8DF]'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all ${
              tab === 'signup'
                ? 'bg-[#C5A880] text-[#0B0C0E] shadow-sm'
                : 'text-[#8A90A0] hover:text-[#EDE8DF]'
            }`}
          >
            Join Network
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-email-input"
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="alexandra@vance-holdings.com"
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Passcode / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-password-input"
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                />
              </div>
            </div>

            <button
              id="signin-submit-btn"
              type="submit"
              className="w-full py-3 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-98"
            >
              Sign In to Private Portal
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Full Legal Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Lord Sterling"
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="sterling@fortvide.com"
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-phone-input"
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="+1 (305) 555-8921"
                  className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] pl-9 pr-3 py-2.5 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A0A5B2] mb-1 font-medium">
                Membership Category
              </label>
              <select
                value={signUpRole}
                onChange={(e) => setSignUpRole(e.target.value as any)}
                className="w-full bg-[#151922] border border-[#242937] focus:border-[#C5A880] text-[#EDE8DF] px-3 py-2.5 rounded-lg outline-none cursor-pointer"
              >
                <option value="VIP Member">VIP Member</option>
                <option value="Investor">Private Investor</option>
                <option value="Property Owner">Property Owner / Seller</option>
                <option value="Client">Private Client</option>
              </select>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full py-3 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-98"
            >
              Create Verified Membership
            </button>
          </form>
        )}

        {/* Demo Fast Login Switcher */}
        <div className="mt-6 pt-5 border-t border-[#1C2029]">
          <span className="text-[10px] tracking-wider uppercase text-[#7A808E] block text-center mb-2.5">
            Instant Demo Profiles
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alexandra@vance-holdings.com')}
              className="p-2 rounded bg-[#141720] hover:bg-[#1A1F2B] border border-[#222633] text-left transition-colors"
            >
              <span className="block text-[11px] font-semibold text-[#EDE8DF]">Alexandra Vance</span>
              <span className="block text-[9px] text-[#C5A880]">VIP Owner (Miami & Bali)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sterling@fortvide.com')}
              className="p-2 rounded bg-[#141720] hover:bg-[#1A1F2B] border border-[#222633] text-left transition-colors"
            >
              <span className="block text-[11px] font-semibold text-[#EDE8DF]">Lord Sterling</span>
              <span className="block text-[9px] text-[#C5A880]">Investor (Dubai & Como)</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-[#5D6372] flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-[#C5A880] mr-1" />
            256-Bit Encrypted Private Client Protection
          </p>
        </div>

      </div>
    </div>
  );
};
