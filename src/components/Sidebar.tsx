import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  PlusSquare, 
  Heart, 
  Flame, 
  Sparkles, 
  Compass, 
  ArrowDownToLine, 
  Radio, 
  Megaphone,
  Music2,
  FolderHeart
} from 'lucide-react';
import { ViewType, Playlist, UserSession, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, id?: string) => void;
  playlists: Playlist[];
  likedCount: number;
  onOpenPromoteModal: () => void;
  onCreatePlaylist: () => void;
  userSession?: UserSession | null;
  onOpenAuthModal?: (mode?: 'login' | 'register', role?: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  playlists,
  likedCount,
  onOpenPromoteModal,
  onCreatePlaylist,
  userSession,
  onOpenAuthModal
}) => {
  return (
    <aside 
      id="main-sidebar"
      className="w-[240px] bg-[#120d09] flex-shrink-0 flex flex-col h-full select-none border-r border-[#261a12] py-6 px-3 gap-5"
    >
      {/* Brand / Logo */}
      <div className="px-3 pb-1">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="logo-brand"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] flex items-center justify-center text-[#120d09] shadow-lg shadow-[#d977062a] group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#fdfaf6] group-hover:text-[#e59a38] transition-colors">
                Nil-<span className="text-[#e59a38]">Son</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#e59a38]/20 text-[#e59a38] border border-[#e59a38]/30 px-1.5 py-0.5 rounded">
                PROMO
              </span>
            </div>
            <p className="text-[10px] text-[#bda998] font-medium">Streaming & Download</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1" id="nav-primary">
        <button
          id="nav-btn-home"
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
            currentView === 'home'
              ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/25 shadow-sm'
              : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-[#e59a38]' : ''}`} />
          <span>Início</span>
        </button>

        <button
          id="nav-btn-search"
          onClick={() => onNavigate('search')}
          className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
            currentView === 'search'
              ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/25'
              : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
          }`}
        >
          <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-[#e59a38]' : ''}`} />
          <span>Buscar</span>
        </button>

        <button
          id="nav-btn-top-downloads"
          onClick={() => onNavigate('top-downloads')}
          className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
            currentView === 'top-downloads'
              ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/25'
              : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentView === 'top-downloads' ? 'text-[#e59a38]' : 'text-amber-500'}`} />
          <div className="flex items-center justify-between flex-1">
            <span>Mais Baixadas</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">HOT</span>
          </div>
        </button>

        <button
          id="nav-btn-releases"
          onClick={() => onNavigate('releases')}
          className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
            currentView === 'releases'
              ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/25'
              : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${currentView === 'releases' ? 'text-[#e59a38]' : 'text-amber-400'}`} />
          <span>Lançamentos</span>
        </button>

        <button
          id="nav-btn-genres"
          onClick={() => onNavigate('genres')}
          className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
            currentView === 'genres'
              ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/25'
              : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentView === 'genres' ? 'text-[#e59a38]' : ''}`} />
          <span>Gêneros & Estilos</span>
        </button>
      </nav>

      {/* Promotion / Artist CTA Box */}
      <div className="my-1">
        <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#26170e] via-[#352014] to-[#1a110a] border border-[#e59a38]/30 shadow-md">
          <div className="flex items-center gap-2 mb-1.5 text-[#e59a38]">
            <Megaphone className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Área do Artista</span>
          </div>
          <p className="text-[11px] text-[#ded0c5] mb-2.5 leading-snug">
            Divulgue sua faixa no Nil-Son, ganhe ouvintes e receba downloads.
          </p>
          <button
            id="btn-promote-sidebar"
            onClick={onOpenPromoteModal}
            className="w-full py-1.5 px-3 bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors shadow"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Divulgar Música</span>
          </button>
        </div>
      </div>

      {/* Library & Playlists Section */}
      <div className="pt-2 border-t border-[#261a12] flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-1.5 text-[#bda998] hover:text-[#fdfaf6] transition-colors">
          <div 
            onClick={() => onNavigate('library')}
            className="flex items-center gap-2 cursor-pointer font-bold text-[11px] uppercase tracking-wider"
          >
            <Library className="w-4 h-4" />
            <span>Sua Biblioteca</span>
          </div>
          <button
            id="btn-create-playlist-plus"
            onClick={onCreatePlaylist}
            title="Criar Playlist"
            className="text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#281a12] p-1 rounded transition-colors"
          >
            <PlusSquare className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-0.5 mt-1">
          <button
            id="nav-btn-liked-songs"
            onClick={() => onNavigate('liked-songs')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              currentView === 'liked-songs'
                ? 'bg-[#281a12] text-[#fdfaf6] border border-[#e59a38]/20'
                : 'text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d]'
            }`}
          >
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#b45309] to-[#e59a38] flex items-center justify-center text-white">
              <Heart className="w-3 h-3 fill-white" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span>Músicas Curtidas</span>
              {likedCount > 0 && (
                <span className="text-[10px] text-[#bda998] font-normal">{likedCount}</span>
              )}
            </div>
          </button>

          <button
            id="btn-create-playlist-row"
            onClick={onCreatePlaylist}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-semibold text-[#bda998] hover:text-[#fdfaf6] hover:bg-[#1c130d] transition-colors"
          >
            <div className="w-5 h-5 rounded bg-[#261a12] flex items-center justify-center text-[#bda998]">
              <PlusSquare className="w-3 h-3" />
            </div>
            <span>Criar Playlist</span>
          </button>
        </div>

        {/* Playlist items scroll */}
        <div className="mt-2 text-[11px] uppercase tracking-wider text-[#bda998] px-3 font-bold">
          Playlists
        </div>
        <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5 text-xs text-[#bda998] scrollbar-thin mt-1">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              id={`playlist-item-${pl.id}`}
              onClick={() => onNavigate('playlist-detail', pl.id)}
              className="w-full text-left px-3 py-1.5 rounded-md hover:text-[#fdfaf6] hover:bg-[#1c130d] truncate transition-colors flex items-center gap-2"
            >
              <Music2 className="w-3 h-3 text-[#947e6e] shrink-0" />
              <span className="truncate">{pl.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Account / Auth Status in Sidebar */}
      <div className="pt-2 border-t border-[#261a12]">
        {userSession ? (
          <div className="p-2.5 rounded-lg bg-[#1a120c] border border-[#2e1d13] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] flex items-center justify-center text-[#120d09] font-black text-xs shrink-0">
                {userSession.role === 'artist' ? '🎤' : (userSession.name.charAt(0).toUpperCase() || '👤')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#fdfaf6] truncate leading-tight">{userSession.name}</p>
                <p className="text-[10px] text-[#e59a38] font-semibold uppercase">
                  {userSession.role === 'artist' ? 'Artista' : 'Ouvinte'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            id="btn-sidebar-auth"
            onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
            className="w-full py-2 px-3 rounded-lg bg-[#20150e] hover:bg-[#2c1d13] border border-[#352317] text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#fdfaf6] group-hover:text-[#e59a38]">
              <span>Entrar / Cadastrar</span>
              <span className="text-[#e59a38] text-[10px]">Grátis</span>
            </div>
            <p className="text-[10px] text-[#9c8777] mt-0.5 leading-tight">
              Sincronize favoritos e playlists
            </p>
          </button>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-1 text-[11px] text-[#947e6e] flex items-center justify-between px-1">
        <span>Nil-Son</span>
        <span className="flex items-center gap-1.5 text-[#e59a38] text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e59a38] animate-pulse"></span>
          Online
        </span>
      </div>
    </aside>
  );
};
