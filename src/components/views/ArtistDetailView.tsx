import React from 'react';
import { CheckCircle2, ArrowDownToLine, Radio, Play, Heart, Share2, Sparkles, Users } from 'lucide-react';
import { Artist, Track } from '../../types';
import { TrackRow } from '../TrackRow';
import { TrackCard } from '../TrackCard';

interface ArtistDetailViewProps {
  artist: Artist;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onShare: (track: Track) => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist,
  tracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onShare
}) => {
  const artistTracks = tracks.filter(t => t.artistId === artist.id || t.artist.toLowerCase().includes(artist.name.toLowerCase()));

  return (
    <div id="view-artist-detail" className="space-y-8 pb-20">
      {/* Artist Hero Header */}
      <div className="relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end p-8 border border-white/10 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120d09] via-[#120d09]/85 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#e59a38]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Artista Verificado</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            {artist.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#ded0c5] font-medium">
            <span className="font-mono text-white font-bold">{(artist.monthlyListeners / 1000000).toFixed(1)}M</span> ouvintes mensais
            <span>•</span>
            <span className="text-[#bda998]">{artist.genres.join(', ')}</span>
          </div>

          <p className="text-xs md:text-sm text-[#ded0c5] max-w-xl line-clamp-2">
            {artist.bio}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {artistTracks[0] && (
          <button
            onClick={() => onPlayToggle(artistTracks[0])}
            className="w-14 h-14 rounded-full bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            <Play className="w-7 h-7 fill-[#120d09] ml-1" />
          </button>
        )}

        <button className="px-5 py-2 border border-[#4d3221] hover:border-[#e59a38] text-[#ded0c5] hover:text-white font-bold text-xs rounded-full uppercase tracking-wider transition-colors">
          Seguir Artista
        </button>
      </div>

      {/* Popular Tracks Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Músicas Populares</h2>
        <div className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-4">
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7 md:col-span-5">Título & Faixa</div>
            <div className="hidden md:block col-span-3">Álbum</div>
            <div className="col-span-2 text-right">Baixar</div>
            <div className="col-span-2 md:col-span-1 text-right">Duração</div>
          </div>
          <div className="space-y-1">
            {artistTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                isPlaying={isPlaying}
                isCurrentTrack={currentTrack?.id === track.id}
                isLiked={likedTrackIds.has(track.id)}
                onPlayToggle={onPlayToggle}
                onOpenDownloadModal={onOpenDownloadModal}
                onToggleLike={onToggleLike}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
