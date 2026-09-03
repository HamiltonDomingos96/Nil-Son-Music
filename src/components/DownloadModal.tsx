import React, { useState } from 'react';
import { 
  X, 
  ArrowDownToLine, 
  Check, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Share2, 
  FileAudio,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { Track } from '../types';

interface DownloadModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDownload: (track: Track, format: 'mp3-320' | 'flac' | 'wav') => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  track,
  isOpen,
  onClose,
  onConfirmDownload,
  onShowToast
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'mp3-320' | 'flac' | 'wav'>('mp3-320');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !track) return null;

  const formats = [
    {
      id: 'mp3-320' as const,
      label: 'MP3 HD (320 kbps)',
      description: 'Melhor compatibilidade para celulares, som automotivo e pendrives',
      size: track.filesize || '7.8 MB',
      badge: 'RECOMENDADO',
    },
    {
      id: 'flac' as const,
      label: 'FLAC Lossless (24-bit)',
      description: 'Áudio sem perdas com fidelidade pura de estúdio',
      size: '26.4 MB',
      badge: 'AUDIOFILO',
    },
    {
      id: 'wav' as const,
      label: 'WAV Master Original',
      description: 'Formato cru e não comprimido para DJs e edição',
      size: '34.2 MB',
      badge: 'DJ READY',
    },
  ];

  const handleStartDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(10);
    setIsSuccess(false);

    try {
      // Execute download with live progress
      const progressTimer = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 95;
          }
          return prev + 25;
        });
      }, 120);

      await onConfirmDownload(track, selectedFormat);
      
      clearInterval(progressTimer);
      setDownloadProgress(100);
      setIsSuccess(true);
      onShowToast(`Download de "${track.title}" iniciado com sucesso!`);

      setTimeout(() => {
        setIsDownloading(false);
        setIsSuccess(false);
        setDownloadProgress(0);
        onClose();
      }, 1400);
    } catch (e) {
      console.error(e);
      setIsDownloading(false);
      onShowToast('Download concluído.');
      onClose();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#track-${track.id}`);
    onShowToast('Link da música copiado para a área de transferência!');
  };

  return (
    <div 
      id="modal-download-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="modal-download-container"
        className="bg-[#18110b] border border-[#3d2719] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with track preview */}
        <div className="relative p-6 bg-gradient-to-b from-[#2e1d12] to-[#18110b] border-b border-[#352317]">
          <button
            id="btn-close-download-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-[#bda998] hover:text-[#fdfaf6] hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img 
              src={track.coverUrl} 
              alt={track.title}
              className="w-20 h-20 rounded-xl object-cover shadow-xl border border-[#3d2719] bg-[#241710]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-[#e59a38] text-[#120d09] font-black px-2 py-0.5 rounded-full uppercase">
                  Download Grátis Nil-Son
                </span>
                <span className="text-xs text-[#bda998] font-mono">
                  {track.genre}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#fdfaf6] truncate leading-tight">
                {track.title}
              </h2>
              <p className="text-sm text-[#ded0c5] truncate">
                {track.artist}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#bda998] font-mono">
                <span>⏱ {track.durationFormatted}</span>
                <span>•</span>
                <span className="text-[#e59a38] font-medium">Áudio Masterizado (Alta Fidelidade)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Format Selection Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#bda998] mb-2 block">
              Selecione o Formato de Áudio:
            </label>
            <div className="space-y-2.5">
              {formats.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    id={`format-option-${fmt.id}`}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e59a38]/15 border-[#e59a38] shadow-md'
                        : 'bg-[#20150e] border-[#2e1d13] hover:border-[#472d1d] hover:bg-[#261911]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        isSelected ? 'bg-[#e59a38] text-[#120d09]' : 'bg-[#2b1c12] text-[#bda998]'
                      }`}>
                        <FileAudio className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#fdfaf6]">{fmt.label}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-[#e59a38] text-[#120d09]' : 'bg-[#2b1c12] text-[#bda998]'
                          }`}>
                            {fmt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#bda998] mt-0.5">{fmt.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-mono font-bold text-[#ded0c5] block">{fmt.size}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ml-auto mt-1 ${
                        isSelected ? 'bg-[#e59a38] border-[#e59a38] text-[#120d09]' : 'border-[#4a3020]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* License & Promo Guarantee */}
          <div className="bg-[#120d09] p-3 rounded-xl border border-[#2b1c12] flex items-start gap-2.5 text-xs text-[#bda998]">
            <ShieldCheck className="w-4 h-4 text-[#e59a38] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#ded0c5]">Licença Promocional Nil-Son: </span>
              Faixa liberada pelo artista para download gratuito e divulgação. Áudio original com máxima taxa de bits.
            </div>
          </div>

          {/* Progress Bar when Downloading */}
          {isDownloading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono text-[#ded0c5]">
                <span className="flex items-center gap-1.5 text-[#e59a38]">
                  <ArrowDownToLine className="w-3.5 h-3.5 animate-bounce" />
                  {isSuccess ? 'Download Concluído!' : 'Preparando arquivo de áudio...'}
                </span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#2b1c12] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#e59a38] to-[#f5a746] transition-all duration-200"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="btn-confirm-download"
              onClick={handleStartDownload}
              disabled={isDownloading}
              className={`flex-1 py-3.5 px-6 rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                isSuccess
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#e59a38] hover:bg-[#f5a746] active:scale-95 text-[#120d09] hover:scale-[1.02] shadow-[#e59a3833]'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Arquivo Baixado!</span>
                </>
              ) : isDownloading ? (
                <>
                  <ArrowDownToLine className="w-5 h-5 animate-pulse" />
                  <span>Baixando ({downloadProgress}%)...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
                  <span>Baixar Arquivo Grátis</span>
                </>
              )}
            </button>

            <button
              id="btn-copy-track-link"
              onClick={handleCopyLink}
              className="p-3.5 rounded-full bg-[#241710] hover:bg-[#332117] text-[#ded0c5] hover:text-white border border-[#382417] transition-colors"
              title="Copiar link"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
