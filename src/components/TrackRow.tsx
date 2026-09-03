import React from 'react';
import { 
  Play, 
  Pause, 
  ArrowDownToLine, 
  Heart, 
  MoreHorizontal,
  Volume2
} from 'lucide-react';
import { Track } from '../types';

interface TrackRowProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  isLiked: boolean;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  showAlbum?: boolean;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isPlaying,
  isCurrentTrack,
  isLiked,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  showAlbum = true
}) => {
  const isThisPlaying = isCurrentTrack && isPlaying;

  return (
    <div 
      id={`track-row-${track.id}`}
      onClick={() => onPlayToggle(track)}
      className={`group grid grid-cols-12 items-center px-4 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
        isCurrentTrack 
          ? 'bg-[#281a12] text-[#e59a38] border border-[#e59a38]/25' 
          : 'hover:bg-[#20150e] text-[#bda998] hover:text-[#fdfaf6]'
      }`}
    >
      {/* Col 1: Index / Play Icon / Equalizer */}
      <div className="col-span-1 flex items-center justify-center text-xs font-medium w-8">
        {isThisPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-0.5 h-3 bg-[#e59a38] animate-pulse" />
            <span className="w-0.5 h-2 bg-[#e59a38] animate-bounce" />
            <span className="w-0.5 h-3.5 bg-[#e59a38] animate-pulse" />
          </div>
        ) : (
          <>
            <span className={`group-hover:hidden ${isCurrentTrack ? 'text-[#e59a38] font-bold' : 'text-[#bda998]'}`}>
              {index + 1}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayToggle(track);
              }}
              className="hidden group-hover:flex items-center justify-center text-[#fdfaf6]"
            >
              <Play className="w-3.5 h-3.5 fill-[#fdfaf6]" />
            </button>
          </>
        )}
      </div>

      {/* Col 2: Title & Artist + Cover */}
      <div className={`${showAlbum ? 'col-span-7 md:col-span-5' : 'col-span-7'} flex items-center gap-3 pr-2 min-w-0`}>
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-10 h-10 rounded object-cover shrink-0 bg-[#241710]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className={`font-medium text-sm truncate ${isCurrentTrack ? 'text-[#e59a38]' : 'text-[#fdfaf6]'}`}>
              {track.title}
            </p>
            {track.releaseDate === 'Novo Lançamento' && (
              <span className="text-[9px] bg-[#e59a38] text-[#120d09] font-black px-1.5 py-0.5 rounded shrink-0">
                NOVO
              </span>
            )}
          </div>
          <p className="text-xs text-[#bda998] truncate hover:underline hover:text-[#fdfaf6] transition-colors">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Col 3: Album (Hidden on mobile/tablet) */}
      {showAlbum && (
        <div className="hidden md:block col-span-3 truncate text-xs text-[#bda998] pr-2">
          {track.album}
        </div>
      )}

      {/* Col 4: Quick Download Button (Aligned) */}
      <div className="col-span-2 flex items-center justify-end">
        <button
          id={`row-btn-download-${track.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDownloadModal(track);
          }}
          className="px-2.5 py-1 bg-[#22160f] hover:bg-[#e59a38] text-[#ded0c5] hover:text-[#120d09] border border-[#352317] hover:border-[#e59a38] rounded font-bold text-xs flex items-center gap-1.5 transition-all group-hover:border-[#4d3221]"
          title={`Baixar ${track.title}`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-[#e59a38] group-hover:text-[#120d09] transition-colors" />
          <span className="hidden sm:inline">Baixar</span>
        </button>
      </div>

      {/* Col 5: Duration & Like (Aligned) */}
      <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-2 text-xs text-[#bda998]">
        <button
          id={`row-btn-like-${track.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track.id);
          }}
          className={`p-1 rounded-full transition-colors ${
            isLiked ? 'text-rose-500' : 'text-[#bda998] opacity-0 group-hover:opacity-100 hover:text-[#fdfaf6]'
          }`}
          title={isLiked ? 'Curtida' : 'Curtir'}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 opacity-100' : ''}`} />
        </button>

        <span className="font-mono text-right">{track.durationFormatted}</span>
      </div>
    </div>
  );
};
