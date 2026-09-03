import React, { useState } from 'react';
import { Flame, ArrowDownToLine, Trophy, Disc, Sparkles, Filter } from 'lucide-react';
import { Track } from '../../types';
import { TrackRow } from '../TrackRow';
import { TrackCard } from '../TrackCard';

interface TopDownloadsViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
}

export const TopDownloadsView: React.FC<TopDownloadsViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const sortedTracks = [...tracks].sort((a, b) => b.downloadsCount - a.downloadsCount);

  const filtered = activeTab === 'all' 
    ? sortedTracks 
    : sortedTracks.filter(t => t.genre.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div id="view-top-downloads" className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-8 bg-gradient-to-r from-[#3d2415] via-[#20150e] to-[#120d09] border border-[#e59a38]/20 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e59a38] to-[#c77d24] flex items-center justify-center text-[#120d09] shadow-xl shadow-[#e59a38]/20">
              <Trophy className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider bg-[#e59a38] text-[#120d09] px-2 py-0.5 rounded">
                  Ranking Nil-Son
                </span>
                <span className="text-xs text-[#bda998] font-mono">Semana Atual</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Músicas Mais Populares no Nil-Son
              </h1>
              <p className="text-sm text-[#ded0c5] mt-1">
                As faixas independentes e lançamentos com maior destaque na comunidade Nil-Son
              </p>
            </div>
          </div>

          <div className="bg-[#120d09]/80 backdrop-blur-md px-4 py-3 rounded-xl border border-[#352317] flex items-center gap-3">
            <Flame className="w-6 h-6 text-[#e59a38]" />
            <div>
              <span className="text-xs text-[#bda998] block">Classificação Nil-Son</span>
              <span className="text-sm font-bold text-[#fdfaf6]">Top Tendências</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2d1e14] pb-4 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'Todos os Gêneros' },
          { id: 'rap', label: 'Rap' },
          { id: 'kuduro', label: 'Kuduro' },
          { id: 'kizomba', label: 'Kizomba' },
          { id: 'semba', label: 'Semba' },
          { id: 'afrohouse', label: 'Afrohouse' },
          { id: 'afrobeat', label: 'Afrobeat' },
          { id: 'r&b', label: 'R&B / Soul' },
          { id: 'trap', label: 'Trap / New School' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#e59a38] text-[#120d09] shadow-lg shadow-[#e59a38]/20'
                : 'bg-[#20150e] text-[#bda998] hover:bg-[#281a12] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ranking List Table */}
      <div className="bg-[#18110b]/80 border border-[#2d1e14] rounded-2xl p-6">
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-[#bda998] uppercase tracking-wider border-b border-[#2d1e14] mb-2">
          <div className="col-span-1 text-center">Posição</div>
          <div className="col-span-7 md:col-span-5">Faixa & Artista</div>
          <div className="hidden md:block col-span-3">Álbum</div>
          <div className="col-span-2 text-right">Baixar</div>
          <div className="col-span-2 md:col-span-1 text-right">Duração</div>
        </div>

        <div className="space-y-1">
          {filtered.map((track, idx) => (
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
  );
};
