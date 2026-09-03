import React from 'react';
import { 
  Play, 
  Pause, 
  ArrowDownToLine, 
  Heart, 
  MoreHorizontal,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  isLiked: boolean;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onSelectArtist?: (artistId: string) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  isLiked,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onSelectArtist
}) => {
  const isThisPlaying = isCurrentTrack && isPlaying;

  return (
    <div 
      id={`track-card-${track.id}`}
      className={`group relative bg-[#18110b] hover:bg-[#241911] p-4 rounded-lg transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
        isCurrentTrack ? 'border-[#e59a38]/60 bg-[#241911] shadow-lg shadow-[#e59a38]/5' : 'border-[#281a11] hover:border-[#3d2719]'
      }`}
      onClick={() => onPlayToggle(track)}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded overflow-hidden mb-3 bg-[#241810] shadow-md">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges on artwork */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {track.releaseDate === 'Novo Lançamento' ? (
            <span className="bg-[#e59a38] text-[#120d09] text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 fill-[#120d09]" /> NOVO
            </span>
          ) : track.isPromoted ? (
            <span className="bg-[#e59a38] text-[#120d09] text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase">
              PROMO
            </span>
          ) : track.isTrending ? (
            <span className="bg-[#f59e0b] text-[#120d09] text-[9px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 fill-[#120d09]" /> HOT
            </span>
          ) : null}
        </div>

        {/* Hover play button (Nil-Son warm amber circle 40px) */}
        <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
          isThisPlaying 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
        }`}>
          <button
            id={`btn-play-card-${track.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle(track);
            }}
            className="w-10 h-10 rounded-full bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
            title={isThisPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-[#120d09]" />
            ) : (
              <Play className="w-5 h-5 fill-[#120d09] ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track Info */}
      <div className="space-y-0.5">
        <h3 className={`font-bold text-sm truncate ${isCurrentTrack ? 'text-[#e59a38]' : 'text-[#fdfaf6]'}`}>
          {track.title}
        </h3>
        <p 
          className="text-xs text-[#bda998] truncate hover:text-[#fdfaf6] transition-colors cursor-pointer"
          onClick={(e) => {
            if (track.artistId && onSelectArtist) {
              e.stopPropagation();
              onSelectArtist(track.artistId);
            }
          }}
        >
          {track.artist}
        </p>
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="mt-3 pt-2.5 border-t border-[#2a1b12] flex items-center justify-between text-xs gap-2">
        <span className="text-[11px] text-[#bda998] font-medium truncate max-w-[90px]">
          {track.genre}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Like button */}
          <button
            id={`btn-like-card-${track.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(track.id);
            }}
            className={`p-1 rounded-full transition-colors ${
              isLiked ? 'text-rose-500' : 'text-[#bda998] hover:text-[#fdfaf6]'
            }`}
            title={isLiked ? 'Curtida' : 'Curtir'}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Quick Download Button */}
          <button
            id={`btn-download-card-${track.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDownloadModal(track);
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#241911] hover:bg-[#e59a38] text-[#ded0c5] hover:text-[#120d09] border border-[#352317] hover:border-[#e59a38] rounded text-[11px] font-bold transition-all"
            title={`Baixar ${track.title}`}
          >
            <ArrowDownToLine className="w-3 h-3 text-[#e59a38] group-hover/btn:text-[#120d09]" />
            <span>Baixar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
