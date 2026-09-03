import React from 'react';
import { Sparkles, Calendar, ArrowDownToLine, Flame } from 'lucide-react';
import { Track } from '../../types';
import { TrackCard } from '../TrackCard';

interface ReleasesViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayToggle: (track: Track) => void;
  onOpenDownloadModal: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onSelectArtist: (artistId: string) => void;
  onOpenPromoteModal?: () => void;
}

export const ReleasesView: React.FC<ReleasesViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayToggle,
  onOpenDownloadModal,
  onToggleLike,
  onSelectArtist,
  onOpenPromoteModal
}) => {
  return (
    <div id="view-releases" className="space-y-8 pb-20">
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#3d2415] via-[#20150e] to-[#120d09] border border-[#e59a38]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e59a38] text-[#120d09] flex items-center justify-center shadow-lg shadow-[#e59a3833] shrink-0">
              <Sparkles className="w-8 h-8 fill-[#120d09]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e59a38]">Novidades & Singles</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">Lançamentos da Semana</h1>
              <p className="text-xs sm:text-sm text-[#ded0c5]">Todas as faixas liberadas recentemente no Nil-Son por artistas e produtores</p>
            </div>
          </div>

          {onOpenPromoteModal && (
            <button
              id="btn-add-new-release"
              onClick={onOpenPromoteModal}
              className="flex items-center justify-center gap-2 bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-black text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-[#120d09]" />
              <span>+ Adicionar Novo Lançamento</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={`rel-page-${track.id}`}
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
  );
};
