import React, { useState } from 'react';
import { X, PlusSquare, Music, Image as ImageIcon } from 'lucide-react';
import { Playlist } from '../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlaylist: Playlist = {
      id: `custom-pl-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Minha playlist personalizada de downloads no Nil-Son',
      coverUrl: coverUrl,
      trackIds: [],
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onCreate(newPlaylist);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#18110b] border border-[#3d2719] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative text-left"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#bda998] hover:text-[#fdfaf6]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#fdfaf6] mb-4 flex items-center gap-2">
          <PlusSquare className="w-5 h-5 text-[#e59a38]" />
          Criar Nova Playlist no Nil-Son
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1">
              Nome da Playlist *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Melhores do Nil-Son 2026"
              className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3 py-2.5 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bda998] mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva o estilo das músicas..."
              rows={3}
              className="w-full bg-[#20150e] border border-[#352317] focus:border-[#e59a38] rounded-lg px-3 py-2 text-sm text-[#fdfaf6] placeholder-[#8c7464] outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#e59a38] hover:bg-[#f5a746] font-black text-sm text-[#120d09] rounded-full transition-colors shadow-lg"
          >
            Criar Playlist
          </button>
        </form>
      </div>
    </div>
  );
};
