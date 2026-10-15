import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreProperties: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onExploreProperties
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  return (
    <div id="video-experience-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-[#0A0C0E] border border-[#222631] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl text-[#E0E2E7] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 bg-[#0A0C0E]/90 border-b border-[#1C2029]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold">
              FORTVÍDE CINEMATIC EXPERIENCE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141720] hover:bg-[#1E222D] text-[#A0A5B2] hover:text-[#FFF] border border-[#232733] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas / Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          {/* High-res cinematic video or scenic showcase loop */}
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            src="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-and-swimming-pool-42861-large.mp4"
            poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
          />

          {/* Bottom Floating Playback Controls Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-black/60 hover:bg-[#C5A880] text-white hover:text-[#0B0C0E] transition-colors border border-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/60 hover:bg-[#C5A880] text-white hover:text-[#0B0C0E] transition-colors border border-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-[#EDE8DF] font-serif tracking-wider hidden sm:inline">
                The Art of Living: 2026 Collection
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onExploreProperties();
              }}
              className="px-4 py-2 rounded bg-[#C5A880] hover:bg-[#d6bc96] text-[#0B0C0E] text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
            >
              Explore Portfolio
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="p-4 bg-[#0F1116] border-t border-[#1C2029] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8A90A0] gap-2">
          <p>Filmed on location in Miami, Dubai, Lake Como, and Monaco.</p>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A880]">
            Ultra-HD 4K Architecture Showcase
          </span>
        </div>

      </div>
    </div>
  );
};
