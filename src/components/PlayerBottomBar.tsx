import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Volume1,
  ArrowDownToLine, 
  Heart, 
  ListMusic, 
  Mic2, 
  Maximize2,
  Sparkles,
  Download
} from 'lucide-react';
import { Track } from '../types';

interface PlayerBottomBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  isLiked: boolean;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  onToggleLike: (trackId: string) => void;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onOpenDownloadModal: (track: Track) => void;
  onSetAsNewRelease?: (track: Track) => void;
}

export const PlayerBottomBar: React.FC<PlayerBottomBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isLoop,
  isLiked,
  isLyricsOpen,
  isQueueOpen,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleLoop,
  onToggleLike,
  onToggleLyrics,
  onToggleQueue,
  onOpenDownloadModal,
  onSetAsNewRelease,
}) => {
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <footer 
        id="player-bottom-bar"
        className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#140e0a] border-t border-[#261a12] z-40 px-4 flex items-center justify-between text-[#bda998]"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded bg-[#20150e] border border-[#2d1e14] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#8c7464]" />
          </div>
          <div>
            <p className="text-sm text-[#fdfaf6] font-medium">Nenhuma música tocando no Nil-Son</p>
            <p className="text-[11px] text-[#bda998]">Selecione uma faixa para ouvir ou baixar</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      id="player-bottom-bar"
      className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#140e0a] border-t border-[#261a12] z-40 px-3 sm:px-4 flex items-center justify-between select-none shadow-2xl relative"
    >
      {/* Mobile-only slim top progress bar */}
      <div 
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, clickX / rect.width));
          onSeek(pct * duration);
        }}
        className="absolute top-0 left-0 right-0 h-1 bg-[#281a12] cursor-pointer sm:hidden"
      >
        <div className="h-full bg-[#e59a38] transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* 1. LEFT: Track Artwork & Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 sm:flex-initial sm:w-[30%] sm:min-w-[180px] min-w-0 pr-2">
        <div className="relative group/art shrink-0">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover shadow-md bg-[#241710]"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center gap-0.5">
              <span className="w-1 h-3 bg-[#e59a38] animate-pulse" />
              <span className="w-1 h-4 bg-[#e59a38] animate-bounce" />
              <span className="w-1 h-2.5 bg-[#e59a38] animate-pulse" />
            </div>
          )}
        </div>

        <div className="min-w-0 pr-1 sm:pr-2 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs sm:text-sm font-medium text-[#fdfaf6] truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </p>
            {currentTrack.isPromoted && (
              <span className="text-[9px] bg-[#e59a38] text-[#120d09] font-black px-1 rounded shrink-0 hidden sm:inline">
                PROMO
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#bda998] truncate hover:text-[#fdfaf6] hover:underline cursor-pointer mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        {/* Like Button */}
        <button
          id="player-btn-like"
          onClick={() => onToggleLike(currentTrack.id)}
          className={`p-1.5 rounded-full transition-colors shrink-0 ${
            isLiked ? 'text-rose-500' : 'text-[#bda998] hover:text-[#fdfaf6]'
          }`}
          title={isLiked ? 'Remover dos favoritos' : 'Curtir'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Set as New Release Button */}
        {onSetAsNewRelease && (
          <button
            id="player-btn-set-release"
            onClick={() => onSetAsNewRelease(currentTrack)}
            className="p-1.5 rounded-full text-[#bda998] hover:text-[#e59a38] hover:bg-[#281a12] transition-colors shrink-0 hidden sm:block"
            title="Adicionar esta música como Novo Lançamento"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. CENTER: Playback Controls & Progress Scrubber */}
      <div className="hidden sm:flex flex-col items-center justify-center w-[42%] max-w-xl px-2">
        {/* Playback Button Row */}
        <div className="flex items-center gap-4 mb-2">
          {/* Shuffle */}
          <button
            id="player-btn-shuffle"
            onClick={onToggleShuffle}
            className={`transition-colors p-1 ${
              isShuffle ? 'text-[#e59a38]' : 'text-[#bda998] hover:text-[#fdfaf6]'
            }`}
            title="Ordem aleatória"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous Track */}
          <button
            id="player-btn-prev"
            onClick={onPrev}
            className="text-[#bda998] hover:text-[#fdfaf6] transition-colors p-1"
            title="Anterior"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause Main Button */}
          <button
            id="player-btn-play-main"
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-[#e59a38] hover:bg-[#f5a746] hover:scale-105 active:scale-95 text-[#120d09] flex items-center justify-center shadow-lg transition-transform"
            title={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-[#120d09]" />
            ) : (
              <Play className="w-4 h-4 fill-[#120d09] ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            id="player-btn-next"
            onClick={onNext}
            className="text-[#bda998] hover:text-[#fdfaf6] transition-colors p-1"
            title="Próxima"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Loop / Repeat */}
          <button
            id="player-btn-loop"
            onClick={onToggleLoop}
            className={`transition-colors p-1 ${
              isLoop ? 'text-[#e59a38]' : 'text-[#bda998] hover:text-[#fdfaf6]'
            }`}
            title="Repetir faixa"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar and time labels */}
        <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-[#bda998]">
          <span className="w-8 text-right select-none">{formatSeconds(currentTime)}</span>
          
          <div 
            className="relative flex-1 h-3 flex items-center cursor-pointer group"
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onSeek(ratio * duration);
            }}
          >
            {/* Background track */}
            <div className="w-full h-1 bg-[#36251b] rounded-full overflow-hidden">
              {/* Active filled track */}
              <div 
                className={`h-full transition-colors ${
                  isHoveringProgress ? 'bg-[#e59a38]' : 'bg-[#ded0c5]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrubber thumb circle */}
            <div 
              className={`absolute w-3 h-3 bg-[#fdfaf6] rounded-full shadow-md -translate-x-1/2 transition-opacity ${
                isHoveringProgress ? 'opacity-100 scale-110' : 'opacity-0'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="w-8 text-left select-none">{formatSeconds(duration)}</span>
        </div>
      </div>

      {/* 3. RIGHT: Download Button (Amber), Lyrics, Queue, Volume */}
      <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0">
        {/* Mobile Play/Pause button */}
        <button
          onClick={onPlayPause}
          className="sm:hidden w-8 h-8 rounded-full bg-[#e59a38] text-[#120d09] flex items-center justify-center shadow"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* DOWNLOAD BUTTON */}
        <button
          id="player-btn-download-highlight"
          onClick={() => onOpenDownloadModal(currentTrack)}
          className="bg-[#e59a38] hover:bg-[#f5a746] active:scale-95 text-[#120d09] font-black text-xs px-3 sm:px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow"
          title="Baixar áudio"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">DOWNLOAD</span>
        </button>

        {/* Lyrics view toggle */}
        <button
          id="player-btn-lyrics-toggle"
          onClick={onToggleLyrics}
          className={`p-1.5 rounded transition-colors hidden sm:block ${
            isLyricsOpen ? 'text-[#e59a38] bg-[#281a12]' : 'text-[#bda998] hover:text-[#fdfaf6]'
          }`}
          title="Letra da música"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue view toggle */}
        <button
          id="player-btn-queue-toggle"
          onClick={onToggleQueue}
          className={`p-1.5 rounded transition-colors ${
            isQueueOpen ? 'text-[#e59a38] bg-[#281a12]' : 'text-[#bda998] hover:text-[#fdfaf6]'
          }`}
          title="Fila de reprodução"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume controls */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            id="player-btn-mute-toggle"
            onClick={onToggleMute}
            className="text-[#bda998] hover:text-[#fdfaf6] transition-colors p-1"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Volume slider */}
          <div className="w-20 group relative flex items-center">
            <input
              id="player-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#36251b] accent-[#e59a38] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
