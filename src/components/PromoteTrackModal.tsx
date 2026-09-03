import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Music, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle, 
  ArrowRight,
  Radio,
  FileAudio
} from 'lucide-react';
import { Track, UserSession } from '../types';

interface PromoteTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTrack: (newTrack: Track) => void;
  onShowToast: (msg: string) => void;
  userSession?: UserSession | null;
  onOpenAuthModal?: (mode?: 'login' | 'register', role?: any) => void;
}

export const PromoteTrackModal: React.FC<PromoteTrackModalProps> = ({
  isOpen,
  onClose,
  onSubmitTrack,
  onShowToast,
  userSession,
  onOpenAuthModal
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(userSession ? userSession.name : '');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState(userSession?.genre || 'Rap');
  const [tagline, setTagline] = useState('Novo single promocional disponível para download gratuito');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('https://cdn.freesound.org/previews/612/612604_5674468-lq.mp3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sampleCovers = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80'
  ];

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAudioUrl(objectUrl);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCoverUrl(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      onShowToast('Preencha o título e o nome do artista.');
      return;
    }

    setIsSubmitting(true);

    const newTrack: Track = {
      id: `custom-track-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Single Promocional',
      duration: 180,
      durationFormatted: '3:00',
      audioUrl: audioUrl,
      coverUrl: coverUrl,
      downloadsCount: Math.floor(Math.random() * 500) + 120,
      playsCount: Math.floor(Math.random() * 2000) + 800,
      releaseDate: 'Novo Lançamento',
      genre: genre,
      isPromoted: true,
      promoTagline: tagline.trim(),
      promoBannerUrl: coverUrl,
      isTrending: true,
      filesize: audioFile ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB` : '7.5 MB',
      bitrate: '320 kbps',
      bpm: 125,
      lyrics: [
        'Música enviada pelo artista independente',
        'Divulgue, compartilhe e baixe gratuitamente!',
        'Nil-Son Apoia Novos Talentos'
      ]
    };

    setTimeout(() => {
      onSubmitTrack(newTrack);
      setIsSubmitting(false);
      onShowToast(`Faixa "${newTrack.title}" adicionada como Novo Lançamento! 🚀`);
      onClose();
    }, 600);
  };

  return (
    <div 
      id="modal-promote-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="modal-promote-container"
        className="bg-[#18110b] border border-[#3d2719] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2a1a11] via-[#382215] to-[#1a110a] border-b border-[#352317] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e59a38] text-[#120d09] flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-[#120d09]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#fdfaf6] flex items-center gap-2">
                Adicionar Novo Lançamento
                <span className="text-[10px] bg-[#e59a38] text-[#120d09] font-black px-2 py-0.5 rounded-full uppercase">
                  Nil-Son
                </span>
              </h2>
              <p className="text-xs text-[#bda998]">
                Publique sua música no feed de novos lançamentos com download liberado
              </p>
            </div>
          </div>

          <button
            id="btn-close-promote-modal"
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-[#bda998] hover:text-[#fdfaf6] hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {userSession?.role === 'artist' ? (
            <div className="p-3 bg-[#e59a38]/15 border border-[#e59a38]/30 rounded-xl flex items-center justify-between text-xs text-[#fdfaf6]">
              <div className="flex items-center gap-2">
                <span className="text-base">🎤</span>
                <div>
                  <p className="font-bold text-[#e59a38]">Perfil de Artista Conectado: {userSession.name}</p>
                  <p className="text-[11px] text-[#ded0c5]">Gênero: {userSession.genre || 'Geral'} • WhatsApp: {userSession.whatsapp || 'Cadastrado'}</p>
                </div>
              </div>
              <span className="text-[10px] bg-[#e59a38] text-[#120d09] px-2 py-0.5 rounded font-black">OFICIAL</span>
            </div>
          ) : (
            <div className="p-3 bg-[#1f150e] border border-[#352317] rounded-xl flex items-center justify-between text-xs text-[#c2ada0]">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <p className="text-[11px] leading-tight">
                  Quer ter perfil oficial verificado no Portal Nil-Son? Cadastre-se como <strong>Artista</strong> via WhatsApp (+244 948 352 425).
                </p>
              </div>
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal('register', 'artist');
                  }}
                  className="shrink-0 ml-2 text-[11px] font-bold text-[#e59a38] hover:underline"
                >
                  Cadastrar Perfil
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
                Título da Música *
              </label>
              <input
                id="input-promote-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Noite de Luanda"
                className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3.5 py-2.5 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none"
              />
            </div>

            {/* Artist */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
                Nome do Artista / DJ *
              </label>
              <input
                id="input-promote-artist"
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: Nil-Son & Amigos"
                className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3.5 py-2.5 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Album */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
                Álbum / EP (Opcional)
              </label>
              <input
                id="input-promote-album"
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Ex: Single 2026"
                className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3.5 py-2.5 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
                Gênero Musical
              </label>
              <select
                id="select-promote-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3.5 py-2.5 text-sm text-[#fdfaf6] outline-none"
              >
                <option value="Rap">Rap</option>
                <option value="Kuduro">Kuduro</option>
                <option value="Kizomba">Kizomba</option>
                <option value="Semba">Semba</option>
                <option value="Afrohouse">Afrohouse</option>
                <option value="Afrobeat">Afrobeat</option>
                <option value="R&B / Soul">R&B / Soul</option>
                <option value="Trap / New School">Trap / New School</option>
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
              Frase de Destaque / Slogan
            </label>
            <input
              id="input-promote-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Ouça o novo hit! Download direto liberado no Nil-Son."
              className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3.5 py-2.5 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none"
            />
          </div>

          {/* Audio Upload Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
              Arquivo de Áudio (.mp3, .wav, .m4a)
            </label>
            <label className="border-2 border-dashed border-[#3d2719] hover:border-[#e59a38] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#20150e] hover:bg-[#271911] transition-colors">
              <input
                id="input-promote-audio-file"
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
              <FileAudio className="w-8 h-8 text-[#e59a38]" />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#ded0c5]">
                  {audioFile ? audioFile.name : 'Clique para selecionar arquivo de áudio'}
                </p>
                <p className="text-[11px] text-[#8c7464]">
                  {audioFile ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Ou utilize a trilha padrão em alta definição'}
                </p>
              </div>
            </label>
          </div>

          {/* Cover Artwork Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1.5">
              Capa do Single / Álbum
            </label>
            <div className="flex items-center gap-3">
              <img 
                src={coverUrl} 
                alt="Preview" 
                className="w-16 h-16 rounded-lg object-cover border border-[#3d2719] shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {sampleCovers.map((c, i) => (
                    <img
                      key={i}
                      src={c}
                      alt="Preset"
                      onClick={() => setCoverUrl(c)}
                      className={`w-10 h-10 rounded cursor-pointer object-cover border transition-all ${
                        coverUrl === c ? 'border-[#e59a38] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <label className="inline-flex items-center gap-1.5 text-xs text-[#e59a38] hover:underline cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Subir imagem personalizada</span>
                  <input
                    id="input-promote-cover-file"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-submit-promote"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#e59a38] hover:bg-[#f5a746] active:scale-95 text-[#120d09] font-black text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#e59a3833]"
            >
              <Sparkles className="w-4 h-4 fill-[#120d09]" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar e Promover Faixa no Nil-Son'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
