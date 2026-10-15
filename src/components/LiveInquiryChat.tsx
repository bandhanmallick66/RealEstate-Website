import React, { useState, useEffect, useRef } from 'react';
import { Property, User, ChatMessage } from '../types';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  FileText, 
  PhoneCall, 
  CheckCheck, 
  Minimize2, 
  Maximize2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveInquiryChatProps {
  property: Property | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBookViewing: (property: Property) => void;
  onOpenConsultation?: () => void;
}

const DEFAULT_AGENT = {
  name: 'Lord Sterling',
  role: 'Managing Director & Private Portfolio Representative',
  phone: '+1 (305) 555-8900',
  email: 'sterling@fortvide.com'
};

const SUGGESTED_INQUIRIES = [
  'Request the architectural dossier & full floor plans',
  'What are the confidential terms for an all-cash closing?',
  'Can we coordinate private yacht or helicopter arrival?',
  'Are adjacent parcels or custom furnishings available?'
];

export const LiveInquiryChat: React.FC<LiveInquiryChatProps> = ({
  property,
  currentUser,
  isOpen,
  onClose,
  onOpenBookViewing,
  onOpenConsultation
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentName = property?.ownerName || DEFAULT_AGENT.name;
  const storageKey = property ? `fortvide_chat_${property.id}` : null;

  // Load chat history or initialize with agent greeting
  useEffect(() => {
    if (!isOpen || !property) return;

    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {
        // ignore JSON parse error
      }
    }

    // Default welcome greeting from the property's listing agent
    const initialGreeting: ChatMessage = {
      id: 'greeting-' + Date.now(),
      sender: 'agent',
      senderName: agentName,
      text: `Good day${currentUser ? ` ${currentUser.name}` : ''}. I am the designated listing representative for "${property.title}" in ${property.location}. How may I assist your acquisition review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([initialGreeting]);
  }, [isOpen, property?.id]);

  // Persist messages
  useEffect(() => {
    if (storageKey && messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        // quota safety
      }
    }
  }, [messages, storageKey]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  if (!isOpen || !property) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      senderName: currentUser?.name || 'Private Client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!textToSend) setInputValue('');

    // Trigger realistic agent concierge response
    setIsAgentTyping(true);
    const delay = Math.min(1800, 1000 + text.length * 15);

    setTimeout(() => {
      setIsAgentTyping(false);
      let replyText = '';
      let isDocDownload = false;
      let docTitle = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('dossier') || lower.includes('floor plan') || lower.includes('brochure')) {
        replyText = `I have unlocked the confidential architectural dossier and structural specifications for ${property.title}. You may access the verified PDF packet directly below.`;
        isDocDownload = true;
        docTitle = `${property.title} — Executive Portfolio & Floorplans.pdf`;
      } else if (lower.includes('cash') || lower.includes('offer') || lower.includes('negotiable') || lower.includes('terms')) {
        replyText = `Our seller is receptive to structured 14-day cash settlement arrangements. For formal proof of funds and escrow protocols, would you prefer a private call with our managing office?`;
      } else if (lower.includes('yacht') || lower.includes('helicopter') || lower.includes('arrival') || lower.includes('security')) {
        replyText = `Understood. The grounds feature private security access and coordinate directly with local aviation and maritime slips. We can arrange VIP transport for your on-site walkthrough.`;
      } else if (lower.includes('viewing') || lower.includes('visit') || lower.includes('tour')) {
        replyText = `We host private, non-disclosure viewings by appointment only. You can select your preferred time slot directly using the booking tool.`;
      } else {
        replyText = `Thank you for your inquiry regarding ${property.title}. Our desk has recorded your note. I can furnish full land registry records, municipal approvals, and tax dossiers at your request.`;
      }

      const agentReply: ChatMessage = {
        id: 'reply-' + Date.now(),
        sender: 'agent',
        senderName: agentName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDocDownload,
        docTitle
      };

      setMessages((prev) => [...prev, agentReply]);
    }, delay);
  };

  const handleResetChat = () => {
    if (!property) return;
    const initialGreeting: ChatMessage = {
      id: 'greeting-' + Date.now(),
      sender: 'agent',
      senderName: agentName,
      text: `Good day${currentUser ? ` ${currentUser.name}` : ''}. I am the designated listing representative for "${property.title}" in ${property.location}. How may I assist your acquisition review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreeting]);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div
      id="live-inquiry-chat-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-end p-2 sm:p-6"
    >
      {/* Background backdrop on mobile for modal focus */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto sm:hidden" 
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`pointer-events-auto relative w-full sm:w-[440px] bg-[#0E1117] border border-[#232938] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(197,168,128,0.15)] flex flex-col overflow-hidden transition-all duration-300 ${
          isMinimized ? 'h-[72px]' : 'h-[620px] max-h-[90vh]'
        }`}
      >
        {/* Top Header: Agent Profile & Controls */}
        <div className="p-4 bg-[#121620] border-b border-[#202636] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 truncate">
            {/* Agent Avatar with Live Beacon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFBA73] to-[#8F7449] p-[1px] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#141824] flex items-center justify-center text-[#EDE8DF] font-serif font-semibold text-sm">
                  {agentName.charAt(0)}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121620]" />
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-xs sm:text-sm text-[#EDE8DF] truncate">
                  {agentName}
                </span>
                <span className="bg-[#C5A880]/15 text-[#C5A880] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium border border-[#C5A880]/30 shrink-0">
                  Direct Agent
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 flex items-center tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
                Active • Typically replies immediately
              </p>
            </div>
          </div>

          {/* Window Controls */}
          <div className="flex items-center space-x-1 text-[#8E94A4]">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-md hover:bg-[#1C2232] hover:text-[#EDE8DF] transition-colors"
              title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-md hover:bg-[#1C2232] hover:text-[#EDE8DF] transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#1C2232] hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content visible when not minimized */}
        {!isMinimized && (
          <>
            {/* Property Context Banner */}
            <div className="px-4 py-2.5 bg-[#161B26] border-b border-[#22293A] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-10 h-10 rounded-lg object-cover border border-[#2B3346] shrink-0"
                />
                <div className="truncate">
                  <span className="text-[11px] font-medium text-[#EDE8DF] truncate block leading-tight">
                    {property.title}
                  </span>
                  <div className="flex items-center text-[10px] text-[#8F96A6] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C5A880] mr-0.5 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-xs font-serif font-semibold text-[#C5A880]">
                  {formattedPrice}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#6A7182] block">
                  {property.category}
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5 bg-[#0B0D12] text-xs">
              {/* Security Shield Indicator */}
              <div className="flex items-center justify-center space-x-1.5 py-1 text-[10px] text-[#6E7585]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>256-Bit Encrypted Confidential Brokerage Channel</span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 px-1">
                      <span className="text-[10px] font-medium text-[#7D8494]">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-[#555C6D]">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-gradient-to-r from-[#D0B388] to-[#C5A880] text-[#0A0C10] font-medium rounded-tr-none'
                          : 'bg-[#151922] text-[#EDE8DF] border border-[#242A3A] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Downloadable Document Attachment if triggered */}
                      {msg.isDocDownload && (
                        <div className="mt-2.5 pt-2 border-t border-[#262C3D] flex items-center justify-between bg-[#10131B] p-2 rounded-lg">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-[#C5A880] shrink-0" />
                            <span className="text-[11px] text-[#EDE8DF] truncate font-sans">
                              {msg.docTitle}
                            </span>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-[#C5A880] shrink-0 ml-2 bg-[#1C2230] px-2 py-0.5 rounded">
                            UNLOCKED
                          </span>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="flex items-center space-x-1 mt-0.5 text-[9px] text-[#5E6575]">
                        <CheckCheck className="w-3 h-3 text-[#C5A880]" />
                        <span>Delivered</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isAgentTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-[#7D8494] mb-1 px-1">{agentName}</span>
                  <div className="bg-[#151922] border border-[#242A3A] rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center space-x-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inquiry Prompts Chips */}
            <div className="px-3 py-2 bg-[#0E1117] border-t border-[#1C2230] overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-none flex items-center">
              <span className="text-[10px] text-[#72798A] uppercase tracking-wider shrink-0 flex items-center mr-1">
                <Sparkles className="w-3 h-3 text-[#C5A880] mr-1" />
                Quick:
              </span>
              {SUGGESTED_INQUIRIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="inline-block px-2.5 py-1 rounded-full bg-[#151924] hover:bg-[#1E2434] border border-[#242A3A] text-[11px] text-[#9EA5B5] hover:text-[#EDE8DF] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Action Bar */}
            <div className="p-3 bg-[#11151E] border-t border-[#202636] space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  id="chat-message-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Inquire with ${agentName}...`}
                  className="flex-grow bg-[#171C27] border border-[#262D3E] focus:border-[#C5A880] text-xs text-[#EDE8DF] px-3.5 py-2.5 rounded-xl outline-none placeholder:text-[#606778] transition-colors shadow-inner"
                />
                <button
                  id="send-chat-message-btn"
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl bg-[#C5A880] hover:bg-[#d4ba94] disabled:opacity-40 disabled:pointer-events-none text-[#090B0E] transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Quick Action: Schedule Viewing Directly */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBookViewing(property);
                  }}
                  className="text-[#C5A880] hover:underline flex items-center space-x-1"
                >
                  <Calendar className="w-3.5 h-3.5 mr-0.5" />
                  <span>Book Formal Viewing</span>
                </button>

                {onOpenConsultation && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenConsultation();
                    }}
                    className="text-[#8E95A5] hover:text-[#EDE8DF] flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3 h-3 mr-0.5" />
                    <span>Private Desk Call</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
