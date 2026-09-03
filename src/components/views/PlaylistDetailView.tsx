import React from 'react';
import { Play, ArrowDownToLine, Heart, Music2, Clock, Share2 } from 'lucide-react';
import { Playlist, Track } from '../../types';
import { TrackRow } from '../TrackRow';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  allTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  allTracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike
}) => {
  const playlistTracks = allTracks.filter(t => playlist.trackIds.includes(t.id));

  return (
    <div id="view-playlist-detail" className="space-y-8 pb-20">
      {/* Playlist Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 p-6 rounded-2xl bg-gradient-to-b from-[#2a1a11] to-[#18110b] border border-[#2d1e14]">
        <img 
          src={playlist.coverUrl} 
          alt={playlist.title}
          className="w-44 h-44 md:w-52 md:h-52 rounded-xl object-cover shadow-2xl shrink-0 bg-[#241710]"
        />
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e59a38]">Playlist Nil-Son</span>
          <h1 className="text-3xl md:text-5xl font-black text-white">{playlist.title}</h1>
          <p className="text-sm text-[#ded0c5] max-w-xl">{playlist.description}</p>
          <div className="flex items-center gap-2 text-xs text-[#bda998] font-mono">
            <span className="text-white font-bold">Nil-Son Curadoria</span>
            <span>•</span>
            <span>{playlistTracks.length} músicas</span>
            <span>•</span>
            <span>Downloads liberados</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {playlistTracks[0] && (
          <button
            onClick={() => onPlayToggle(playlistTracks[0])}
            className="w-14 h-14 rounded-full bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          >
            <Play className="w-7 h-7 fill-[#120d09] ml-1" />
          </button>
        )}
      </div>

      {/* Track List Table */}
      <div className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-4">
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-7 md:col-span-5">Título & Artista</div>
          <div className="hidden md:block col-span-3">Álbum</div>
          <div className="col-span-2 text-right">Baixar</div>
          <div className="col-span-2 md:col-span-1 text-right">Duração</div>
        </div>

        <div className="space-y-1">
          {playlistTracks.map((track, idx) => (
            <TrackRow
              key={`pl-track-${track.id}`}
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
  );
};
