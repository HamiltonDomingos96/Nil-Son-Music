import React from 'react';
import { Search, Play, ArrowDownToLine, Heart, Sparkles, User } from 'lucide-react';
import { Track, Artist, GenreCategory } from '../../types';
import { TrackCard } from '../TrackCard';
import { TrackRow } from '../TrackRow';

interface SearchViewProps {
  searchTerm: string;
  onSearchChange: (q: string) => void;
  tracks: Track[];
  artists: Artist[];
  genres: GenreCategory[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onSelectArtist: (artistId: string) => void;
  onSelectGenre: (genreId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchTerm,
  onSearchChange,
  tracks,
  artists,
  genres,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onSelectArtist,
  onSelectGenre
}) => {
  const query = searchTerm.toLowerCase().trim();

  // Filtered lists
  const filteredTracks = tracks.filter((t) => 
    t.title.toLowerCase().includes(query) ||
    t.artist.toLowerCase().includes(query) ||
    t.album.toLowerCase().includes(query) ||
    t.genre.toLowerCase().includes(query)
  );

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(query) ||
    a.genres.some((g) => g.toLowerCase().includes(query))
  );

  const topResult = filteredTracks[0] || null;

  return (
    <div id="view-search" className="space-y-8 pb-20">
      {/* If no search term entered, show Browse all genres */}
      {!searchTerm ? (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Navegar por Todas as Seções</h1>
            <p className="text-xs text-zinc-400">Descubra e baixe faixas organizadas por categorias</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => onSelectGenre(genre.name)}
                style={{ backgroundColor: genre.color }}
                className="relative h-32 md:h-36 rounded-xl p-4 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                <h3 className="font-extrabold text-lg text-white max-w-[70%]">
                  {genre.name}
                </h3>
                <span className="text-xs text-white/80 block mt-1">
                  {genre.trackCount} faixas
                </span>
                <img 
                  src={genre.imageUrl} 
                  alt={genre.name}
                  className="absolute -bottom-2 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover shadow-2xl rotate-[25deg]"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Resultados para <span className="text-[#e59a38]">"{searchTerm}"</span>
            </h2>
            <span className="text-xs text-[#bda998] font-mono">
              {filteredTracks.length} músicas encontradas
            </span>
          </div>

          {filteredTracks.length === 0 && filteredArtists.length === 0 ? (
            <div className="text-center py-16 text-[#bda998] space-y-3">
              <Search className="w-12 h-12 text-[#6e5442] mx-auto" />
              <h3 className="text-lg font-bold text-white">Nenhum resultado encontrado</h3>
              <p className="text-xs max-w-sm mx-auto text-[#8c7464]">
                Tente buscar por outro termo, nome de artista, gênero (ex: Trap, Eletrônica, Kizomba) ou navegue pelas seções.
              </p>
            </div>
          ) : (
            <>
              {/* Top Result + Top 4 Tracks Layout (Spotify style) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Best Match Card */}
                {topResult && (
                  <div className="lg:col-span-5 space-y-3">
                    <h3 className="text-base font-bold text-white">Melhor Resultado</h3>
                    <div 
                      onClick={() => onPlayToggle(topResult)}
                      className="bg-[#1a120c] hover:bg-[#251a12] p-6 rounded-2xl transition-all cursor-pointer group relative border border-[#2d1e14] hover:border-[#4d3221]"
                    >
                      <img 
                        src={topResult.coverUrl} 
                        alt={topResult.title}
                        className="w-24 h-24 rounded-xl object-cover shadow-xl mb-4 bg-[#241710]"
                      />
                      <h4 className="text-2xl font-black text-white truncate group-hover:text-[#e59a38] transition-colors">
                        {topResult.title}
                      </h4>
                      <p className="text-sm text-[#bda998] mt-1">
                        <span className="text-white font-medium">{topResult.artist}</span> • <span className="bg-[#e59a38]/20 text-[#e59a38] px-1.5 py-0.5 rounded text-xs font-bold uppercase">{topResult.genre}</span>
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDownloadModal(topResult);
                          }}
                          className="px-4 py-2 bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-black text-xs rounded-full flex items-center gap-1.5 shadow"
                        >
                          <ArrowDownToLine className="w-4 h-4" />
                          <span>Baixar MP3</span>
                        </button>
                      </div>

                      {/* Hover play button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayToggle(topResult);
                        }}
                        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#e59a38] text-[#120d09] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-[#120d09] ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Matching Songs List */}
                <div className={`${topResult ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                  <h3 className="text-base font-bold text-white">Músicas</h3>
                  <div className="space-y-1 bg-[#18110b]/80 p-2 rounded-2xl border border-[#2d1e14]">
                    {filteredTracks.slice(0, 5).map((track, idx) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        showAlbum={!topResult}
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

              {/* Matching Artists */}
              {filteredArtists.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-white">Artistas Encontrados</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => onSelectArtist(artist.id)}
                        className="bg-[#1a120c] hover:bg-[#251a12] p-4 rounded-xl text-center cursor-pointer group transition-all border border-[#2d1e14] hover:border-[#4d3221]"
                      >
                        <img 
                          src={artist.avatarUrl} 
                          alt={artist.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform bg-[#120d09]"
                        />
                        <h4 className="font-bold text-sm text-white truncate group-hover:text-[#e59a38]">
                          {artist.name}
                        </h4>
                        <p className="text-xs text-[#bda998] mt-0.5">Artista</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All matching tracks grid */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-white">Todas as Faixas Correspondentes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredTracks.map((track) => (
                    <TrackCard
                      key={`grid-${track.id}`}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrentTrack={currentTrack?.id === track.id}
                      isLiked={likedTrackIds.has(track.id)}
                      onPlayToggle={onPlayToggle}
                      onOpenDownloadModal={onOpenDownloadModal}
                      onToggleLike={onToggleLike}
                      onSelectArtist={onSelectArtist}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
