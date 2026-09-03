import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Users, 
  Compass, 
  ArrowRight, 
  ArrowDownToLine, 
  Radio, 
  Play, 
  TrendingUp,
  Download
} from 'lucide-react';
import { Track, Artist, GenreCategory, Playlist, ViewType } from '../../types';
import { HeroBanner } from '../HeroBanner';
import { TrackCard } from '../TrackCard';
import { TrackRow } from '../TrackRow';

interface HomeViewProps {
  promotedTrack: Track;
  tracks: Track[];
  artists: Artist[];
  genres: GenreCategory[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onAddToQueue: (track: Track) => void;
  onShare: (track: Track) => void;
  onNavigate: (view: ViewType, id?: string) => void;
  onSelectArtist: (artistId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  promotedTrack,
  tracks,
  artists,
  genres,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onAddToQueue,
  onShare,
  onNavigate,
  onSelectArtist
}) => {
  // Sort tracks for sections
  const topDownloadedTracks = [...tracks].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 6);
  const newReleases = [...tracks].slice(0, 6);
  const trendingList = [...tracks].sort((a, b) => b.playsCount - a.playsCount).slice(0, 5);

  return (
    <div id="view-home" className="space-y-10 pb-20">
      {/* 1. HERO PROMOTED BANNER */}
      <HeroBanner
        track={promotedTrack}
        isPlaying={isPlaying}
        isCurrentTrack={currentTrack?.id === promotedTrack.id}
        isLiked={likedTrackIds.has(promotedTrack.id)}
        onPlayToggle={onPlayToggle}
        onOpenDownloadModal={onOpenDownloadModal}
        onToggleLike={onToggleLike}
        onAddToQueue={onAddToQueue}
        onShare={onShare}
      />

      {/* 2. MÚSICAS MAIS BAIXADAS (Top Downloads Grid) */}
      <section id="section-top-downloads">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Músicas Mais Baixadas
              </h2>
              <p className="text-xs text-zinc-400">As faixas mais buscadas para download gratuito esta semana</p>
            </div>
          </div>

          <button
            id="btn-see-all-downloads"
            onClick={() => onNavigate('top-downloads')}
            className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topDownloadedTracks.map((track) => (
            <TrackCard
              key={track.id}
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
      </section>

      {/* 3. LANÇAMENTOS RECENTES & PROMOÇÕES DA SEMANA */}
      <section id="section-new-releases">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#e59a38]/20 text-[#e59a38]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Lançamentos da Semana
              </h2>
              <p className="text-xs text-zinc-400">Produções novas e exclusivas de artistas independentes</p>
            </div>
          </div>

          <button
            id="btn-see-all-releases"
            onClick={() => onNavigate('releases')}
            className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Ver lançamentos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newReleases.map((track) => (
            <TrackCard
              key={`rel-${track.id}`}
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
      </section>

      {/* 4. TOP RANKING LIST VIEW & DOWNLOAD STATS (Spotify Chart style) */}
      <section id="section-chart-table" className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e59a38] block mb-1">
              RANKING POPULAR
            </span>
            <h2 className="text-xl font-bold text-white">Top Faixas em Alta no Nil-Son</h2>
          </div>
          <div className="text-xs text-[#bda998] font-mono">
            Atualizado em tempo real
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-7 md:col-span-5">Título & Artista</div>
          <div className="hidden md:block col-span-3">Álbum</div>
          <div className="col-span-2 text-right">Baixar</div>
          <div className="col-span-2 md:col-span-1 text-right">Duração</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-1">
          {trendingList.map((track, idx) => (
            <TrackRow
              key={`chart-${track.id}`}
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
      </section>

      {/* 5. ARTISTAS EM DESTAQUE */}
      <section id="section-featured-artists">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Artistas em Destaque
              </h2>
              <p className="text-xs text-zinc-400">Produtores e cantores promovendo músicas na comunidade</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              id={`artist-card-${artist.id}`}
              onClick={() => onSelectArtist(artist.id)}
              className="bg-[#1a120c] hover:bg-[#251a12] p-4 rounded-xl transition-all duration-300 text-center cursor-pointer group border border-[#2d1e14] hover:border-[#4d3221]"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 mx-auto shadow-xl bg-[#120d09]">
                <img 
                  src={artist.avatarUrl} 
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-sm text-white truncate group-hover:text-[#e59a38] transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-[#bda998] truncate mt-0.5">
                {(artist.monthlyListeners / 1000000).toFixed(1)}M ouvintes/mês
              </p>
              <div className="mt-2 text-[11px] text-[#bda998] font-medium flex items-center justify-center gap-1">
                <span className="text-[#e59a38]">•</span>
                <span>{artist.genres[0] || 'Música'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXPLORAR GÊNEROS (Spotify-style colorful genre tiles) */}
      <section id="section-genres-tiles">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Explorar por Gênero
              </h2>
              <p className="text-xs text-zinc-400">Encontre faixas para baixar no seu estilo musical preferido</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.id}
              id={`genre-tile-${genre.id}`}
              onClick={() => onNavigate('genres')}
              style={{ backgroundColor: genre.color }}
              className="relative h-28 md:h-32 rounded-xl p-4 overflow-hidden cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <h3 className="font-extrabold text-base md:text-lg text-white leading-tight max-w-[65%]">
                {genre.name}
              </h3>
              <span className="text-[11px] text-white/80 block mt-1">
                {genre.trackCount} faixas liberadas
              </span>
              {/* Rotated image in bottom right */}
              <img 
                src={genre.imageUrl} 
                alt={genre.name}
                className="absolute -bottom-2 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover shadow-2xl rotate-[25deg]"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
