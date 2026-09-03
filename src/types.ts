export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  duration: number; // in seconds
  durationFormatted: string;
  audioUrl: string;
  coverUrl: string;
  downloadsCount: number;
  playsCount: number;
  releaseDate: string;
  genre: string;
  isPromoted?: boolean;
  promoTagline?: string;
  promoBannerUrl?: string;
  isTrending?: boolean;
  isExplicit?: boolean;
  filesize: string;
  bitrate: string;
  lyrics?: string[];
  bpm?: number;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  coverUrl: string;
  monthlyListeners: number;
  totalDownloads: number;
  bio: string;
  verified: boolean;
  genres: string[];
}

export interface GenreCategory {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
  trackCount: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isCustom?: boolean;
  createdAt: string;
}

export type ViewType = 
  | 'home' 
  | 'search' 
  | 'library' 
  | 'top-downloads' 
  | 'releases' 
  | 'genres' 
  | 'artist-detail' 
  | 'playlist-detail' 
  | 'liked-songs'
  | 'genre-detail';

export interface DownloadEvent {
  trackId: string;
  format: 'mp3-320' | 'flac' | 'wav';
  timestamp: number;
}

export type UserRole = 'listener' | 'artist';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  genre?: string;
  whatsapp?: string;
  registeredAt: string;
}
