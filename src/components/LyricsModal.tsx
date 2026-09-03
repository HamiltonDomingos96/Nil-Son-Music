import React from 'react';
import { X, Mic2, Music, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface LyricsModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  currentTime: number;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  track,
  isOpen,
  onClose,
  currentTime
}) => {
  if (!isOpen || !track) return null;

  const lyrics = track.lyrics || [
    '♪ Instrumental ou letra em sincronização ♪',
    'Aproveite a melodia em alta fidelidade no Nil-Son'
  ];

  return (
    <div 
      id="modal-lyrics-overlay"
      className="fixed inset-0 z-50 bg-[#120d09]/95 backdrop-blur-2xl flex flex-col p-6 md:p-12 overflow-hidden animate-in fade-in duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#352317] max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <img 
            src={track.coverUrl} 
            alt={track.title}
            className="w-16 h-16 rounded-xl object-cover shadow-2xl border border-[#3d2719] bg-[#241710]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e59a38] flex items-center gap-1">
                <Mic2 className="w-3.5 h-3.5" /> Letra da Música
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#fdfaf6]">{track.title}</h2>
            <p className="text-sm text-[#bda998]">{track.artist}</p>
          </div>
        </div>

        <button
          id="btn-close-lyrics"
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 text-[#ded0c5] hover:text-[#fdfaf6] hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Lyrics Content with big typography */}
      <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full py-12 space-y-6 text-center md:text-left scrollbar-thin">
        {lyrics.map((line, idx) => {
          // Highlight current line based on rough time division
          const activeIndex = Math.floor((currentTime / (track.duration || 180)) * lyrics.length);
          const isCurrent = idx === activeIndex;

          return (
            <p 
              key={idx}
              className={`text-2xl md:text-4xl font-extrabold tracking-tight transition-all duration-300 cursor-pointer ${
                isCurrent 
                  ? 'text-[#fdfaf6] scale-105 origin-left' 
                  : 'text-[#6e5442] hover:text-[#ded0c5]'
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>

      <div className="text-center text-xs text-[#8c7464] py-4 border-t border-[#261a12] max-w-4xl mx-auto w-full">
        Letra fornecida para fins promocionais • Nil-Son Lyrics Engine
      </div>
    </div>
  );
};
