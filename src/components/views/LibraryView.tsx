import React, { useState } from 'react';
import { Heart, Library, PlusSquare, ArrowDownToLine, Music2, FolderHeart, Play } from 'lucide-react';
import { Track, Playlist } from '../../types';
import { TrackRow } from '../TrackRow';
import { TrackCard } from '../TrackCard';

interface LibraryViewProps {
  tracks: Track[];
  likedTracks: Track[];
  playlists: Playlist[];
  downloadedTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onCreatePlaylist: () => void;
  onSelectPlaylist: (playlistId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  likedTracks,
  playlists,
  downloadedTracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onCreatePlaylist,
  onSelectPlaylist
}) => {
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists' | 'downloads'>('liked');

  return (
    <div id="view-library" className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-8 bg-gradient-to-r from-[#382215] via-[#20150e] to-[#120d09] border border-[#e59a38]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c77d24] to-[#e59a38] flex items-center justify-center text-[#120d09] shadow-xl">
              <Library className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e59a38]">Coleção Pessoal</span>
              <h1 className="text-3xl md:text-4xl font-black text-white">Sua Biblioteca Nil-Son</h1>
              <p className="text-sm text-[#ded0c5]">Suas músicas curtidas, playlists criadas e histórico de downloads</p>
            </div>
          </div>

          <button
            onClick={onCreatePlaylist}
            className="flex items-center gap-2 bg-[#241710] hover:bg-[#301f15] text-[#fdfaf6] font-bold text-xs px-4 py-2.5 rounded-full border border-[#3d2719] transition-all"
          >
            <PlusSquare className="w-4 h-4 text-[#e59a38]" />
            <span>Criar Playlist</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2d1e14] pb-3">
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'liked'
              ? 'bg-[#e59a38] text-[#120d09] font-black shadow'
              : 'bg-[#20150e] text-[#bda998] hover:bg-[#281a12]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Músicas Curtidas ({likedTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'playlists'
              ? 'bg-[#e59a38] text-[#120d09] font-black shadow'
              : 'bg-[#20150e] text-[#bda998] hover:bg-[#281a12]'
          }`}
        >
          <Music2 className="w-3.5 h-3.5 text-[#e59a38]" />
          <span>Playlists ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'downloads'
              ? 'bg-[#e59a38] text-[#120d09] font-black shadow'
              : 'bg-[#20150e] text-[#bda998] hover:bg-[#281a12]'
          }`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-[#e59a38]" />
          <span>Downloads Realizados ({downloadedTracks.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          {likedTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#1a120c] rounded-2xl border border-[#2d1e14] space-y-3">
              <Heart className="w-12 h-12 text-[#6e5442] mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhuma música curtida ainda</h3>
              <p className="text-xs text-[#bda998] max-w-sm mx-auto">
                Clique no coração de qualquer faixa para salvá-la aqui na sua coleção pessoal.
              </p>
            </div>
          ) : (
            <div className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-4">
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7 md:col-span-5">Título & Artista</div>
                <div className="hidden md:block col-span-3">Álbum</div>
                <div className="col-span-2 text-right">Baixar</div>
                <div className="col-span-2 md:col-span-1 text-right">Duração</div>
              </div>
              <div className="space-y-1">
                {likedTracks.map((track, idx) => (
                  <TrackRow
                    key={`liked-${track.id}`}
                    track={track}
                    index={idx}
                    isPlaying={isPlaying}
                    isCurrentTrack={currentTrack?.id === track.id}
                    isLiked={true}
                    onPlayToggle={onPlayToggle}
                    onOpenDownloadModal={onOpenDownloadModal}
                    onToggleLike={onToggleLike}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className="bg-[#1a120c] hover:bg-[#251a12] p-4 rounded-xl cursor-pointer group transition-all border border-[#2d1e14] hover:border-[#4d3221]"
            >
              <img 
                src={pl.coverUrl} 
                alt={pl.title}
                className="w-full aspect-square rounded-lg object-cover mb-3 shadow-lg bg-[#241710]"
              />
              <h3 className="font-bold text-sm text-white truncate group-hover:text-[#e59a38] transition-colors">
                {pl.title}
              </h3>
              <p className="text-xs text-[#bda998] line-clamp-2 mt-1">{pl.description}</p>
              <span className="text-[11px] text-[#8c7464] block mt-2 font-mono">{pl.trackIds.length} faixas</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {downloadedTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#1a120c] rounded-2xl border border-[#2d1e14] space-y-3">
              <ArrowDownToLine className="w-12 h-12 text-[#6e5442] mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhum download efetuado nesta sessão</h3>
              <p className="text-xs text-[#bda998] max-w-sm mx-auto">
                Baixe faixas nos formatos MP3, FLAC ou WAV para encontrá-las facilmente no seu histórico Nil-Son.
              </p>
            </div>
          ) : (
            <div className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-4">
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7 md:col-span-5">Título & Artista</div>
                <div className="hidden md:block col-span-3">Álbum</div>
                <div className="col-span-2 text-right">Baixar</div>
                <div className="col-span-2 md:col-span-1 text-right">Duração</div>
              </div>
              <div className="space-y-1">
                {downloadedTracks.map((track, idx) => (
                  <TrackRow
                    key={`dl-hist-${track.id}`}
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
          )}
        </div>
      )}
    </div>
  );
};
