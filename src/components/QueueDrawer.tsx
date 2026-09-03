import React from 'react';
import { X, Play, Trash2, ListMusic, ArrowDownToLine, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  queue: Track[];
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  queue,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="queue-drawer"
      className="fixed bottom-20 right-0 top-16 w-80 md:w-96 bg-[#18110b]/95 backdrop-blur-xl border-l border-t border-[#2d1e14] z-30 flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-200 text-left"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#2d1e14]">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#e59a38]" />
          <h3 className="font-bold text-base text-[#fdfaf6]">Fila de Reprodução Nil-Son</h3>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-[#bda998] hover:text-rose-400 transition-colors p-1"
              title="Limpar fila"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#281a12] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
        {/* Now playing */}
        {currentTrack && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#bda998] block mb-2">
              Tocando Agora
            </span>
            <div className="p-2.5 rounded-lg bg-[#241710] border border-[#e59a38]/30 flex items-center gap-3">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover bg-[#1a110a]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#e59a38] truncate">{currentTrack.title}</p>
                <p className="text-xs text-[#bda998] truncate">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Up next queue */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#bda998]">
              A Seguir na Fila ({queue.length})
            </span>
          </div>

          {queue.length === 0 ? (
            <div className="p-6 text-center text-[#8c7464] text-xs">
              Sua fila está vazia. Adicione músicas clicando no ícone de lista nos cards ou banners do Nil-Son!
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#251a12] transition-colors cursor-pointer"
                  onClick={() => onPlayTrack(track)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title}
                      className="w-9 h-9 rounded object-cover shrink-0 bg-[#241710]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#fdfaf6] truncate">{track.title}</p>
                      <p className="text-[11px] text-[#bda998] truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] font-mono text-[#8c7464] mr-1">{track.durationFormatted}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromQueue(idx);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#bda998] hover:text-rose-400 transition-all"
                      title="Remover da fila"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
