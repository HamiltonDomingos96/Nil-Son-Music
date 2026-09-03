import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  ArrowDownToLine, 
  Sparkles,
  Menu,
  CheckCircle2,
  User,
  LogIn,
  LogOut,
  Phone,
  Music,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ViewType, UserSession, UserRole } from '../types';

interface TopNavProps {
  currentView: ViewType;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  onOpenPromoteModal: () => void;
  onToggleMobileSidebar: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  totalDownloadsCount?: number;
  userSession?: UserSession | null;
  onOpenAuthModal?: (mode?: 'login' | 'register', role?: UserRole) => void;
  onLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  searchTerm,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  onOpenPromoteModal,
  onToggleMobileSidebar,
  onNavigateBack,
  onNavigateForward,
  canGoBack,
  canGoForward,
  userSession,
  onOpenAuthModal,
  onLogout
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const filters = [
    { id: 'all', label: 'Tudo' },
    { id: 'promoted', label: '⭐ Promovidos' },
    { id: 'top-downloads', label: '🔥 Mais Baixados' },
    { id: 'Rap', label: 'Rap' },
    { id: 'Kuduro', label: 'Kuduro' },
    { id: 'Kizomba', label: 'Kizomba' },
    { id: 'Semba', label: 'Semba' },
    { id: 'Afrohouse', label: 'Afrohouse' },
    { id: 'Afrobeat', label: 'Afrobeat' },
    { id: 'R&B / Soul', label: 'R&B / Soul' },
    { id: 'Trap / New School', label: 'Trap / New School' },
  ];

  return (
    <header 
      id="top-navbar"
      className="sticky top-0 z-30 bg-[#140e0a]/95 backdrop-blur-md px-6 py-3 border-b border-[#261a12] flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Navigation History Controls & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="btn-mobile-menu"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-full bg-[#20150e] text-[#fdfaf6] hover:bg-[#2a1c13] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <button
              id="btn-history-back"
              onClick={onNavigateBack}
              disabled={!canGoBack}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                canGoBack
                  ? 'bg-[#22160f] text-[#fdfaf6] hover:bg-[#301f14] cursor-pointer border border-[#332216]'
                  : 'bg-[#18110b] text-[#5e4b3e] cursor-not-allowed border border-transparent'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="btn-history-forward"
              onClick={onNavigateForward}
              disabled={!canGoForward}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                canGoForward
                  ? 'bg-[#22160f] text-[#fdfaf6] hover:bg-[#301f14] cursor-pointer border border-[#332216]'
                  : 'bg-[#18110b] text-[#5e4b3e] cursor-not-allowed border border-transparent'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Search Bar with Nil-Son dark brown aesthetic */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="w-4 h-4 text-[#a69182] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#e59a38] transition-colors" />
            <input
              id="search-input-field"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="O que você quer ouvir ou baixar no Nil-Son?"
              className="w-full bg-[#1c130d] hover:bg-[#241911] focus:bg-[#241911] text-[#fdfaf6] placeholder-[#9c8677] text-xs md:text-sm font-medium rounded-full pl-10 pr-9 py-2 outline-none border border-[#2e1e14] focus:border-[#e59a38]/60 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                id="btn-clear-search"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a69182] hover:text-[#fdfaf6]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            id="btn-top-promote-cta"
            onClick={onOpenPromoteModal}
            className="hidden sm:flex items-center gap-2 bg-[#e59a38] hover:bg-[#f5a746] active:scale-95 text-[#120d09] font-bold text-xs px-4 py-2 rounded-full transition-all shadow-md hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#120d09]" />
            <span>Divulgar Música</span>
          </button>

          {/* User Profile / Auth Action */}
          {userSession ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                id="user-profile-pill"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#20150e] hover:bg-[#2e1d13] text-xs font-bold text-[#fdfaf6] cursor-pointer transition-all border border-[#3a271a] focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] flex items-center justify-center text-[#120d09] font-black text-xs shadow">
                  {userSession.role === 'artist' ? '🎤' : (userSession.name.charAt(0).toUpperCase() || '👤')}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-[#fdfaf6] max-w-[100px] truncate leading-tight">
                    {userSession.name}
                  </span>
                  <span className="text-[9px] text-[#e59a38] uppercase font-semibold">
                    {userSession.role === 'artist' ? 'Artista' : 'Ouvinte'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#a89383]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-[#1a120c] border border-[#352317] rounded-xl shadow-2xl p-3 z-50 animate-fadeIn text-[#fdfaf6]"
                >
                  <div className="pb-3 border-b border-[#2b1c12]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-extrabold truncate text-[#fdfaf6]">{userSession.name}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#e59a38]/20 text-[#e59a38] border border-[#e59a38]/30">
                        {userSession.role === 'artist' ? 'Artista' : 'Ouvinte'}
                      </span>
                    </div>
                    {userSession.role === 'artist' && userSession.genre && (
                      <p className="text-[11px] text-[#e59a38] flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        <span>Gênero: {userSession.genre}</span>
                      </p>
                    )}
                    {userSession.whatsapp && (
                      <p className="text-[11px] text-[#a89383] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp: {userSession.whatsapp}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Support integration */}
                  <div className="py-2.5 border-b border-[#2b1c12]">
                    <a
                      href="https://wa.me/244948352425"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs text-[#c2ada0] hover:text-[#e59a38] py-1 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Suporte Oficial WhatsApp</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-[#a89383]" />
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      id="btn-logout-dropdown"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-top-login"
                onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                className="text-xs font-bold text-[#fdfaf6] hover:text-[#e59a38] px-3 py-1.5 rounded-full hover:bg-[#20150e] transition-colors"
              >
                Entrar
              </button>
              <button
                id="btn-top-register"
                onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                className="bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-black text-xs px-3.5 py-1.5 rounded-full transition-all shadow-md active:scale-95"
              >
                Cadastre-se
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills (Visible on Home and Search) */}
      {(currentView === 'home' || currentView === 'search') && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" id="category-pills">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                id={`filter-pill-${filter.id}`}
                onClick={() => onSelectFilter(filter.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#e59a38] text-[#120d09] font-bold shadow'
                    : 'bg-[#1c130d] text-[#c2ada0] hover:bg-[#281a12] hover:text-[#fdfaf6] border border-[#2c1d13]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
