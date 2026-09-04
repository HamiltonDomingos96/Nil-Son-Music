import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  push, 
  onValue, 
  update, 
  Database 
} from 'firebase/database';
import { UserSession, Playlist, Track } from '../types';

// Configuração fornecida para o Firebase Realtime Database
export const firebaseConfig = {
  apiKey: "INSERIR_API_KEY_AQUI",
  authDomain: "planning-with-ai-a3d22.firebaseapp.com",
  databaseURL: "https://planning-with-ai-a3d22-default-rtdb.firebaseio.com/",
  projectId: "planning-with-ai-a3d22",
  storageBucket: "planning-with-ai-a3d22.appspot.com",
  messagingSenderId: "INSERIR_SENDER_ID_AQUI",
  appId: "INSERIR_APP_ID_AQUI"
};

let app;
let database: Database | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  database = getDatabase(app);
  
  // Disponibilizar globalmente para depuração e compatibilidade com scripts legados
  if (typeof window !== 'undefined') {
    (window as any).firebaseApp = app;
    (window as any).firebaseDatabase = database;
  }
} catch (error) {
  console.warn('Firebase Realtime Database initialization warning:', error);
}

export { database };

/**
 * Salva ou atualiza a sessão do utilizador no Realtime Database
 */
export async function syncUserToFirebase(session: UserSession): Promise<boolean> {
  if (!database) return false;
  try {
    const userRef = ref(database, `users/${session.id}`);
    await set(userRef, {
      ...session,
      updatedAt: new Date().toISOString()
    });

    // Também registra na lista de novos cadastros para a equipa Nil-Son
    const registrationRef = ref(database, `registrations/${session.id}`);
    await set(registrationRef, {
      id: session.id,
      name: session.name,
      role: session.role,
      genre: session.genre || null,
      whatsapp: session.whatsapp || null,
      socialLink: session.socialLink || null,
      registeredAt: session.registeredAt || new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.warn('Firebase RTDB: Não foi possível sincronizar utilizador online (salvo em localStorage):', error);
    return false;
  }
}

/**
 * Sincroniza os favoritos do usuário no Realtime Database
 */
export async function syncFavoritesToFirebase(userId: string, likedTrackIds: string[]): Promise<boolean> {
  if (!database || !userId) return false;
  try {
    const favRef = ref(database, `user_favorites/${userId}`);
    await set(favRef, {
      trackIds: likedTrackIds,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn('Firebase RTDB: Não foi possível sincronizar favoritos online:', error);
    return false;
  }
}

/**
 * Carrega os favoritos do usuário do Realtime Database
 */
export async function fetchFavoritesFromFirebase(userId: string): Promise<string[] | null> {
  if (!database || !userId) return null;
  try {
    const favRef = ref(database, `user_favorites/${userId}`);
    const snapshot = await get(favRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data.trackIds) ? data.trackIds : [];
    }
  } catch (error) {
    console.warn('Firebase RTDB: Falha ao carregar favoritos:', error);
  }
  return null;
}

/**
 * Sincroniza as playlists personalizadas do utilizador
 */
export async function syncPlaylistsToFirebase(userId: string, playlists: Playlist[]): Promise<boolean> {
  if (!database || !userId) return false;
  try {
    const playlistRef = ref(database, `user_playlists/${userId}`);
    await set(playlistRef, {
      playlists: playlists.filter(p => p.isCustom),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn('Firebase RTDB: Não foi possível sincronizar playlists online:', error);
    return false;
  }
}

/**
 * Registra novo pedido de promoção de música no Realtime Database
 */
export async function submitPromotionToFirebase(track: Track, userSession?: UserSession | null): Promise<boolean> {
  if (!database) return false;
  try {
    const promoRef = push(ref(database, 'music_promotions'));
    await set(promoRef, {
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      audioUrl: track.audioUrl,
      coverUrl: track.coverUrl,
      submittedBy: userSession ? {
        id: userSession.id,
        name: userSession.name,
        role: userSession.role,
        whatsapp: userSession.whatsapp || null
      } : null,
      createdAt: new Date().toISOString(),
      status: 'pending_review'
    });
    return true;
  } catch (error) {
    console.warn('Firebase RTDB: Não foi possível submeter promoção online:', error);
    return false;
  }
}
