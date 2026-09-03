import React from 'react';
import { 
  Play, 
  Pause, 
  ArrowDownToLine, 
  CheckCircle2, 
  Flame, 
  Heart, 
  ListPlus, 
  Radio,
  Share2,
  Sparkles
} from 'lucide-react';
import { Track } from '../types';

interface HeroBannerProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  isLiked: boolean;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onAddToQueue: (track: Track) => void;
  onShare: (track: Track) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  isLiked,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onAddToQueue,
  onShare
}) => {
  const isThisPlaying = isCurrentTrack && isPlaying;

  return (
    <section 
      id="hero-promoted-banner"
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#321a0e] via-[#4d2613] to-[#6d3619] border border-[#e59a38]/30 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-[0_12px_36px_rgba(0,0,0,0.6)] text-[#fdfaf6]"
    >
      {/* Left column: Track details & CTA buttons */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-[#e59a38] text-[#120d09] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-[#120d09]" />
            NOVO LANÇAMENTO
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ded0c5]">
            Destaque Nil-Son
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
          {track.title}
        </h1>

        <p className="text-sm md:text-base text-[#f5ede4]/90 mb-4 max-w-xl font-normal leading-relaxed">
          {track.promoTagline || `O lançamento em destaque de ${track.artist}. Disponível para streaming e download gratuito.`}
        </p>

        {/* Highlight Metrics */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold mb-6">
          <span className="flex items-center gap-1.5 bg-black/30 text-[#fdfaf6] border border-[#e59a38]/30 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#e59a38]" />
            {track.artist}
          </span>
          <span className="bg-black/30 text-[#fdfaf6] border border-white/10 px-3 py-1 rounded-full text-xs font-mono">
            {track.genre}
          </span>
          <span className="bg-[#e59a38]/20 text-[#e59a38] border border-[#e59a38]/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            Download Disponível
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Button */}
          <button
            id="hero-btn-play"
            onClick={() => onPlayToggle(track)}
            className="w-full sm:w-auto justify-center bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-black text-sm md:text-base px-7 py-3 rounded-full transition-all shadow-lg hover:scale-105 flex items-center gap-2"
          >
            {isThisPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-[#120d09]" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-[#120d09] ml-0.5" />
                <span>Ouvir Agora</span>
              </>
            )}
          </button>

          {/* Secondary Outline Button */}
          <button
            id="hero-btn-download"
            onClick={() => onOpenDownloadModal(track)}
            className="w-full sm:w-auto justify-center bg-black/25 hover:bg-black/40 text-[#fdfaf6] border border-[#e59a38]/60 hover:border-[#e59a38] font-bold text-sm md:text-base px-7 py-3 rounded-full transition-all flex items-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
            <span>Baixar Grátis</span>
          </button>

          {/* Like button */}
          <button
            id="hero-btn-like"
            onClick={() => onToggleLike(track.id)}
            className={`p-3 rounded-full transition-all ${
              isLiked
                ? 'bg-rose-500/20 border border-rose-500 text-rose-400 shadow'
                : 'bg-black/30 border border-[#e59a38]/20 text-[#ded0c5] hover:text-white hover:bg-black/50'
            }`}
            title={isLiked ? 'Remover dos favoritos' : 'Curtir música'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Add to Queue */}
          <button
            id="hero-btn-queue"
            onClick={() => onAddToQueue(track)}
            className="p-3 rounded-full bg-black/30 border border-[#e59a38]/20 text-[#ded0c5] hover:text-white hover:bg-black/50 transition-colors"
            title="Adicionar à fila"
          >
            <ListPlus className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            id="hero-btn-share"
            onClick={() => onShare(track)}
            className="p-3 rounded-full bg-black/30 border border-[#e59a38]/20 text-[#ded0c5] hover:text-white hover:bg-black/50 transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right column: Artwork container */}
      <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg bg-[#1a110a] border border-[#e59a38]/30 shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 relative group">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <button
            onClick={() => onPlayToggle(track)}
            className="w-12 h-12 rounded-full bg-[#e59a38] text-[#120d09] flex items-center justify-center shadow-xl hover:scale-110 transition-transform opacity-95 group-hover:opacity-100"
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-[#120d09]" />
            ) : (
              <Play className="w-5 h-5 fill-[#120d09] ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
