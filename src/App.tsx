/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  INITIAL_TRACKS, 
  FEATURED_ARTISTS, 
  GENRES_LIST, 
  INITIAL_PLAYLISTS 
} from './data/mockData';
import { 
  Track, 
  Artist, 
  GenreCategory, 
  Playlist, 
  ViewType,
  UserSession,
  UserRole
} from './types';
import { audioEngine, downloadTrackFile } from './utils/audioEngine';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { PlayerBottomBar } from './components/PlayerBottomBar';
import { DownloadModal } from './components/DownloadModal';
import { PromoteTrackModal } from './components/PromoteTrackModal';
import { LyricsModal } from './components/LyricsModal';
import { QueueDrawer } from './components/QueueDrawer';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { ToastNotification } from './components/ToastNotification';
import { AuthModal } from './components/AuthModal';
import { 
  syncFavoritesToFirebase, 
  fetchFavoritesFromFirebase, 
  syncPlaylistsToFirebase, 
  submitPromotionToFirebase 
} from './services/firebase';

// Views
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { TopDownloadsView } from './components/views/TopDownloadsView';
import { ReleasesView } from './components/views/ReleasesView';
import { LibraryView } from './components/views/LibraryView';
import { ArtistDetailView } from './components/views/ArtistDetailView';
import { PlaylistDetailView } from './components/views/PlaylistDetailView';

export default function App() {
  // Main Data States
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('soundvault_tracks');
    if (saved) {
      try {
        const parsed: Track[] = JSON.parse(saved);
        // Sync any updated properties from INITIAL_TRACKS (like new audioUrl, genre)
        const updated = parsed.map((p) => {
          const match = INITIAL_TRACKS.find((it) => it.id === p.id);
          if (match) {
            return { 
              ...p, 
              audioUrl: match.audioUrl, 
              title: match.title, 
              artist: match.artist,
              genre: match.genre 
            };
          }
          return p;
        });
        const missingInitial = INITIAL_TRACKS.filter((it) => !updated.some((t) => t.id === it.id));
        return [...missingInitial, ...updated];
      } catch {
        return INITIAL_TRACKS;
      }
    }
    return INITIAL_TRACKS;
  });

  const [artists] = useState<Artist[]>(FEATURED_ARTISTS);
  const [genres] = useState<GenreCategory[]>(GENRES_LIST);

  // User Authentication & Session
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('listener');

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'register', role: UserRole = 'listener') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const sessionRaw = localStorage.getItem('user_session');
    if (sessionRaw) {
      try {
        const sess = JSON.parse(sessionRaw);
        const userSaved = localStorage.getItem(`user_${sess.id}_playlists`);
        if (userSaved) return JSON.parse(userSaved);
      } catch {}
    }
    const saved = localStorage.getItem('soundvault_playlists');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });

  // User Library & Preferences (Linked to User Session)
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(() => {
    const sessionRaw = localStorage.getItem('user_session');
    if (sessionRaw) {
      try {
        const sess = JSON.parse(sessionRaw);
        const userSaved = localStorage.getItem(`user_${sess.id}_liked_tracks`);
        if (userSaved) return new Set(JSON.parse(userSaved));
      } catch {}
    }
    const saved = localStorage.getItem('soundvault_liked_tracks');
    return saved ? new Set(JSON.parse(saved)) : new Set(['track-1', 'track-2']);
  });

  const [downloadHistoryIds, setDownloadHistoryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('soundvault_downloads');
    return saved ? JSON.parse(saved) : ['track-1'];
  });

  // Audio Playback State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_TRACKS[0].duration || 194);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(() => INITIAL_TRACKS.slice(1, 4));

  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [navHistory, setNavHistory] = useState<ViewType[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Modals & UI Drawers
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [trackToDownload, setTrackToDownload] = useState<Track | null>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState<boolean>(false);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('soundvault_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('soundvault_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('soundvault_liked_tracks', JSON.stringify(Array.from(likedTrackIds)));
  }, [likedTrackIds]);

  useEffect(() => {
    localStorage.setItem('soundvault_downloads', JSON.stringify(downloadHistoryIds));
  }, [downloadHistoryIds]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  // Audio Engine Lifecycle
  useEffect(() => {
    audioEngine.setCallbacks(
      (time, dur) => {
        setCurrentTime(time);
        if (dur && !isNaN(dur) && dur > 0) {
          setDuration(dur);
        }
      },
      () => {
        // Track ended handler
        handleNextTrack();
      },
      (playing) => {
        setIsPlaying(playing);
      }
    );
  }, [currentTrack, queue, isShuffle, isLoop, tracks]);

  // Playback Control Handlers
  const handlePlayTrack = useCallback((track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioEngine.pause();
      } else {
        audioEngine.resume(track.audioUrl, track.duration || 180, track.bpm || 120);
      }
    } else {
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.duration || 180);
      audioEngine.playTrack(track.audioUrl, track.duration || 180, track.bpm || 120);

      // Increment play count
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, playsCount: t.playsCount + 1 } : t))
      );
    }
  }, [currentTrack, isPlaying]);

  const handlePlayPause = useCallback(() => {
    if (!currentTrack) {
      if (tracks[0]) handlePlayTrack(tracks[0]);
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.resume(currentTrack.audioUrl, currentTrack.duration || 180, currentTrack.bpm || 120);
    }
  }, [currentTrack, isPlaying, tracks, handlePlayTrack]);

  const handleNextTrack = useCallback(() => {
    if (isLoop && currentTrack) {
      audioEngine.seek(0);
      audioEngine.playTrack(currentTrack.audioUrl, currentTrack.duration, currentTrack.bpm);
      return;
    }

    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      handlePlayTrack(next);
      return;
    }

    // Next from tracks list
    if (tracks.length === 0) return;
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else if (currentTrack) {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    handlePlayTrack(tracks[nextIndex]);
  }, [queue, tracks, currentTrack, isLoop, isShuffle, handlePlayTrack]);

  const handlePrevTrack = useCallback(() => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }
    if (tracks.length === 0) return;
    const currentIndex = currentTrack ? tracks.findIndex((t) => t.id === currentTrack.id) : 0;
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePlayTrack(tracks[prevIndex]);
  }, [currentTrack, currentTime, tracks, handlePlayTrack]);

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    audioEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.toggleMute(nextMuted);
  }, [isMuted]);

  const handleToggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
    showToast(!isShuffle ? 'Ordem aleatória ativada' : 'Ordem aleatória desativada');
  }, [isShuffle, showToast]);

  const handleToggleLoop = useCallback(() => {
    const next = !isLoop;
    setIsLoop(next);
    audioEngine.setLoop(next);
    showToast(next ? 'Repetição de faixa ativada' : 'Repetição de faixa desativada');
  }, [isLoop, showToast]);

  // Auth session callbacks
  const handleAuthSuccess = useCallback((session: UserSession, isNewRegister?: boolean) => {
    setUserSession(session);
    // Load this user's liked tracks
    const savedLikes = localStorage.getItem(`user_${session.id}_liked_tracks`);
    if (savedLikes) {
      try {
        setLikedTrackIds(new Set(JSON.parse(savedLikes)));
      } catch {}
    }
    // Also try fetch from Firebase RTDB
    fetchFavoritesFromFirebase(session.id).then((cloudLikes) => {
      if (cloudLikes && cloudLikes.length > 0) {
        setLikedTrackIds((prev) => new Set([...Array.from(prev), ...cloudLikes]));
      }
    }).catch(console.warn);

    // Load this user's custom playlists
    const savedPls = localStorage.getItem(`user_${session.id}_playlists`);
    if (savedPls) {
      try {
        const parsed: Playlist[] = JSON.parse(savedPls);
        setPlaylists((prev) => {
          const defaults = prev.filter(p => !p.isCustom);
          return [...defaults, ...parsed];
        });
      } catch {}
    }

    if (isNewRegister) {
      showToast(`Bem-vindo ao Portal Nil-Son, ${session.name}!`);
    } else {
      showToast(`Olá, ${session.name}! Sessão iniciada.`);
    }
  }, [showToast]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user_session');
    setUserSession(null);
    showToast('Sessão encerrada com sucesso.');
  }, [showToast]);

  // Likes & Favorites (requiring auth for persistent account sync)
  const handleToggleLike = useCallback((trackId: string) => {
    if (!userSession) {
      showToast('Entre ou cadastre-se para favoritar músicas');
      handleOpenAuthModal('register');
      return;
    }

    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        showToast('Removida das Músicas Curtidas');
      } else {
        next.add(trackId);
        showToast('Adicionada às Músicas Curtidas ❤️');
      }
      const arr = Array.from(next) as string[];
      localStorage.setItem(`user_${userSession.id}_liked_tracks`, JSON.stringify(arr));
      syncFavoritesToFirebase(userSession.id, arr).catch(console.warn);
      return next;
    });
  }, [userSession, showToast]);

  // Queue Operations
  const handleAddToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
    showToast(`"${track.title}" adicionada à fila`);
  }, [showToast]);

  const handleRemoveFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearQueue = useCallback(() => {
    setQueue([]);
    showToast('Fila limpa');
  }, [showToast]);

  // Download Action
  const handleOpenDownloadModal = useCallback((track: Track) => {
    setTrackToDownload(track);
    setIsDownloadModalOpen(true);
  }, []);

  const handleConfirmDownload = useCallback(async (track: Track, format: 'mp3-320' | 'flac' | 'wav') => {
    await downloadTrackFile(track.title, track.artist, track.audioUrl, format);

    // Update track downloads count
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, downloadsCount: t.downloadsCount + 1 } : t))
    );

    // Add to download history
    setDownloadHistoryIds((prev) => Array.from(new Set([track.id, ...prev])));
  }, []);

  // Navigation History
  const navigateTo = useCallback((view: ViewType, id?: string) => {
    if (id) {
      if (view === 'artist-detail') setSelectedArtistId(id);
      if (view === 'playlist-detail') setSelectedPlaylistId(id);
    }
    setCurrentView(view);
    setIsMobileSidebarOpen(false);

    setNavHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, view];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Add Custom Track (Artist Promote / New Release)
  const handlePromoteTrackSubmit = useCallback((newTrack: Track) => {
    const releaseTrack: Track = {
      ...newTrack,
      isPromoted: true,
      releaseDate: 'Novo Lançamento',
      promoTagline: newTrack.promoTagline || 'NOVO LANÇAMENTO OFICIAL NO NIL-SON • DISPONÍVEL AGORA',
    };
    setTracks((prev) => [releaseTrack, ...prev]);
    // Sincroniza pedido no Firebase Realtime Database
    submitPromotionToFirebase(releaseTrack, userSession).catch(console.warn);
    handlePlayTrack(releaseTrack);
    navigateTo('releases');
    showToast(`"${releaseTrack.title}" adicionada como Novo Lançamento! 🚀`);
  }, [userSession, handlePlayTrack, navigateTo, showToast]);

  // Set any track as new release
  const handleSetAsNewRelease = useCallback((track: Track) => {
    const updated: Track = {
      ...track,
      isPromoted: true,
      releaseDate: 'Novo Lançamento',
      promoTagline: 'NOVO LANÇAMENTO EM DESTAQUE NO NIL-SON • OUÇA E BAIXE AGORA',
    };
    setTracks((prev) => [updated, ...prev.filter((t) => t.id !== track.id)]);
    setCurrentTrack(updated);
    showToast(`"${track.title}" adicionada como Novo Lançamento! 🚀`);
    navigateTo('releases');
  }, [navigateTo, showToast]);

  // Create Playlist & Open Handler
  const handleOpenCreatePlaylist = useCallback(() => {
    if (!userSession) {
      showToast('Entre ou cadastre-se para criar playlists');
      handleOpenAuthModal('register');
      return;
    }
    setIsCreatePlaylistOpen(true);
  }, [userSession, showToast]);

  const handleCreatePlaylist = useCallback((newPlaylist: Playlist) => {
    setPlaylists((prev) => {
      const updated = [newPlaylist, ...prev];
      if (userSession) {
        const customOnly = updated.filter(p => p.isCustom);
        localStorage.setItem(`user_${userSession.id}_playlists`, JSON.stringify(customOnly));
        syncPlaylistsToFirebase(userSession.id, updated).catch(console.warn);
      }
      return updated;
    });
    showToast(`Playlist "${newPlaylist.title}" criada!`);
    setSelectedPlaylistId(newPlaylist.id);
    setCurrentView('playlist-detail');
  }, [userSession, showToast]);

  // Share Track
  const handleShareTrack = useCallback((track: Track) => {
    const url = `${window.location.origin}/#track-${track.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`Link de "${track.title}" copiado!`);
    } else {
      showToast(`Compartilhando ${track.title}`);
    }
  }, [showToast]);

  const handleNavigateBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentView(navHistory[newIndex]);
    }
  }, [historyIndex, navHistory]);

  const handleNavigateForward = useCallback(() => {
    if (historyIndex < navHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentView(navHistory[newIndex]);
    }
  }, [historyIndex, navHistory]);

  // Active Filter Filtering (for Home view)
  const filteredTracks = useMemo(() => {
    if (activeFilter === 'all') return tracks;
    if (activeFilter === 'promoted') return tracks.filter((t) => t.isPromoted);
    if (activeFilter === 'top-downloads') {
      return [...tracks].sort((a, b) => b.downloadsCount - a.downloadsCount);
    }
    return tracks.filter((t) => t.genre.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [tracks, activeFilter]);

  // Promoted Track of the Week
  const promotedTrack = useMemo(() => {
    return tracks.find((t) => t.isPromoted) || tracks[0];
  }, [tracks]);

  // Liked tracks objects
  const likedTracksList = useMemo(() => {
    return tracks.filter((t) => likedTrackIds.has(t.id));
  }, [tracks, likedTrackIds]);

  // Downloaded tracks objects
  const downloadedTracksList = useMemo(() => {
    return tracks.filter((t) => downloadHistoryIds.includes(t.id));
  }, [tracks, downloadHistoryIds]);

  // Total downloads counter calculation
  const totalDownloadsToday = useMemo(() => {
    return tracks.reduce((acc, t) => acc + t.downloadsCount, 0);
  }, [tracks]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        handlePrevTrack();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'l' && currentTrack) {
        handleToggleLike(currentTrack.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleNextTrack, handlePrevTrack, handleToggleMute, handleToggleLike, currentTrack]);

  // Selected Artist / Playlist
  const selectedArtist = artists.find((a) => a.id === selectedArtistId) || artists[0];
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];

  return (
    <div id="soundvault-app" className="h-screen w-screen flex flex-col bg-[#121212] text-white overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* App Body (Sidebar + Central Scrollable Feed) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar
            currentView={currentView}
            onNavigate={navigateTo}
            playlists={playlists}
            likedCount={likedTrackIds.size}
            onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
            onCreatePlaylist={handleOpenCreatePlaylist}
            userSession={userSession}
            onOpenAuthModal={handleOpenAuthModal}
          />
        </div>

        {/* Mobile Slide-in Drawer Sidebar */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div className="w-72 h-full bg-[#120d09] border-r border-[#261a12] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                currentView={currentView}
                onNavigate={navigateTo}
                playlists={playlists}
                likedCount={likedTrackIds.size}
                onOpenPromoteModal={() => {
                  setIsMobileSidebarOpen(false);
                  setIsPromoteModalOpen(true);
                }}
                onCreatePlaylist={() => {
                  setIsMobileSidebarOpen(false);
                  handleOpenCreatePlaylist();
                }}
                userSession={userSession}
                onOpenAuthModal={handleOpenAuthModal}
              />
            </div>
          </div>
        )}

        {/* Main Central View Area */}
        <main id="main-content-scroll" className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#251710] via-[#120d09] to-[#0f0b08]">
          {/* Top Sticky Navigation */}
          <TopNav
            currentView={currentView}
            searchTerm={searchTerm}
            onSearchChange={(q) => {
              setSearchTerm(q);
              if (currentView !== 'search') {
                navigateTo('search');
              }
            }}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onNavigateBack={handleNavigateBack}
            onNavigateForward={handleNavigateForward}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < navHistory.length - 1}
            totalDownloadsCount={totalDownloadsToday}
            userSession={userSession}
            onOpenAuthModal={handleOpenAuthModal}
            onLogout={handleLogout}
          />

          {/* Central Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
            {/* 1. Home View */}
            {currentView === 'home' && (
              <HomeView
                promotedTrack={promotedTrack}
                tracks={filteredTracks}
                artists={artists}
                genres={genres}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onAddToQueue={handleAddToQueue}
                onShare={handleShareTrack}
                onNavigate={navigateTo}
                onSelectArtist={(artistId) => navigateTo('artist-detail', artistId)}
              />
            )}

            {/* 2. Search View */}
            {currentView === 'search' && (
              <SearchView
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                tracks={tracks}
                artists={artists}
                genres={genres}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onSelectArtist={(artistId) => navigateTo('artist-detail', artistId)}
                onSelectGenre={(genreId) => {
                  setActiveFilter(genreId);
                  navigateTo('home');
                }}
              />
            )}

            {/* 3. Top Downloads View */}
            {currentView === 'top-downloads' && (
              <TopDownloadsView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
              />
            )}

            {/* 4. Releases View */}
            {currentView === 'releases' && (
              <ReleasesView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onSelectArtist={(artistId) => navigateTo('artist-detail', artistId)}
                onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
              />
            )}

            {/* 5. Genres Grid View */}
            {currentView === 'genres' && (
              <div className="space-y-6 pb-20">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-white">Todos os Gêneros Musicais</h1>
                  <p className="text-xs text-zinc-400">Explore faixas disponíveis para streaming e download por estilo</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {genres.map((genre) => (
                    <div
                      key={genre.id}
                      onClick={() => {
                        setActiveFilter(genre.name);
                        navigateTo('home');
                      }}
                      style={{ backgroundColor: genre.color }}
                      className="relative h-36 rounded-xl p-5 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform"
                    >
                      <h3 className="font-black text-xl text-white max-w-[70%] leading-tight">
                        {genre.name}
                      </h3>
                      <span className="text-xs text-white/80 block mt-1 font-mono">
                        {genre.trackCount} faixas
                      </span>
                      <img 
                        src={genre.imageUrl} 
                        alt={genre.name}
                        className="absolute -bottom-2 -right-4 w-24 h-24 rounded-lg object-cover shadow-2xl rotate-[25deg]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Library View */}
            {currentView === 'library' && (
              <LibraryView
                tracks={tracks}
                likedTracks={likedTracksList}
                playlists={playlists}
                downloadedTracks={downloadedTracksList}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onCreatePlaylist={handleOpenCreatePlaylist}
                onSelectPlaylist={(plId) => navigateTo('playlist-detail', plId)}
                userSession={userSession}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {/* 7. Liked Songs View Shortcut */}
            {currentView === 'liked-songs' && (
              <LibraryView
                tracks={tracks}
                likedTracks={likedTracksList}
                playlists={playlists}
                downloadedTracks={downloadedTracksList}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onCreatePlaylist={handleOpenCreatePlaylist}
                onSelectPlaylist={(plId) => navigateTo('playlist-detail', plId)}
                userSession={userSession}
                onOpenAuthModal={handleOpenAuthModal}
              />
            )}

            {/* 8. Artist Detail View */}
            {currentView === 'artist-detail' && selectedArtist && (
              <ArtistDetailView
                artist={selectedArtist}
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
                onShare={handleShareTrack}
              />
            )}

            {/* 9. Playlist Detail View */}
            {currentView === 'playlist-detail' && selectedPlaylist && (
              <PlaylistDetailView
                playlist={selectedPlaylist}
                allTracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayToggle={handlePlayTrack}
                onOpenDownloadModal={handleOpenDownloadModal}
                onToggleLike={handleToggleLike}
              />
            )}
          </div>
        </main>
      </div>

      {/* Fixed Bottom Player Bar */}
      <PlayerBottomBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        isLoop={isLoop}
        isLiked={currentTrack ? likedTrackIds.has(currentTrack.id) : false}
        isLyricsOpen={isLyricsModalOpen}
        isQueueOpen={isQueueOpen}
        onPlayPause={handlePlayPause}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleShuffle={handleToggleShuffle}
        onToggleLoop={handleToggleLoop}
        onToggleLike={handleToggleLike}
        onToggleLyrics={() => setIsLyricsModalOpen(!isLyricsModalOpen)}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        onOpenDownloadModal={handleOpenDownloadModal}
        onSetAsNewRelease={handleSetAsNewRelease}
      />

      {/* Drawers and Modals */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        currentTrack={currentTrack}
        queue={queue}
        onPlayTrack={handlePlayTrack}
        onRemoveFromQueue={handleRemoveFromQueue}
        onClearQueue={handleClearQueue}
      />

      <LyricsModal
        isOpen={isLyricsModalOpen}
        onClose={() => setIsLyricsModalOpen(false)}
        track={currentTrack}
        currentTime={currentTime}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        track={trackToDownload}
        onConfirmDownload={handleConfirmDownload}
        onShowToast={showToast}
      />

      <PromoteTrackModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        onSubmitTrack={handlePromoteTrackSubmit}
        onShowToast={showToast}
        userSession={userSession}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      {/* Modal de Autenticação e Perfil Nil-Son */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />

      {/* Global Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
