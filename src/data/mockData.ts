import { Track, Artist, GenreCategory, Playlist } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-guedes-demonios',
    title: 'Demônios',
    artist: 'Guedes Rodrigues',
    artistId: 'artist-guedes-rodrigues',
    album: 'Demônios - Single',
    duration: 210,
    durationFormatted: '3:30',
    audioUrl: 'https://www.dropbox.com/scl/fi/31huklkwo5k8p2bjuqrvy/Guedes-Rodrigues-Dem-nios.mp3?rlkey=wuf0hpslg168ybj1yl1p1ry7j&st=2j0m11rl&dl=1',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 54300,
    playsCount: 289400,
    releaseDate: 'Novo Lançamento',
    genre: 'Rap',
    isPromoted: true,
    promoTagline: 'NOVO LANÇAMENTO OFICIAL NO NIL-SON • GUEDES RODRIGUES - DEMÔNIOS (DISPONÍVEL AGORA)',
    promoBannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    isTrending: true,
    filesize: '8.2 MB',
    bitrate: '320 kbps',
    bpm: 130,
    lyrics: [
      'Guedes Rodrigues no beat pesado',
      'Verso afiado, coração blindado',
      'Enfrentando demônios na escuridão',
      'Minha rima é a luz dessa conexão',
      '(Refrão)',
      'Demônios que tentam me derrubar',
      'Mas com cada rima eu vou me levantar',
      'Nil-Son tocando no mais alto padrão',
      'Download liberado, bate o coração!'
    ]
  },
  {
    id: 'track-new-release',
    title: 'Vibração Perfeita',
    artist: 'Hamilton Domingos & Nil-Son Sound',
    artistId: 'artist-1',
    album: 'Lançamento Nil-Son 2026',
    duration: 204,
    durationFormatted: '3:24',
    // Public high quality royalty-free test audio
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 52100,
    playsCount: 265000,
    releaseDate: 'Novo Lançamento',
    genre: 'Afrohouse',
    isPromoted: false,
    promoTagline: 'NOVO LANÇAMENTO OFICIAL NO NIL-SON • DISPONÍVEL AGORA PARA STREAMING E DOWNLOAD',
    promoBannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80',
    isTrending: true,
    filesize: '8.2 MB',
    bitrate: '320 kbps',
    bpm: 128,
    lyrics: [
      'Novo som na pista, batida envolvente',
      'Nil-Son conectando toda a nossa gente',
      'Grave bate forte, a energia não para',
      'Esse lançamento é o som que dispara',
      '(Refrão)',
      'Vibração perfeita, som de qualidade',
      'Direto no fone, espalhando liberdade',
      'Baixa sem limites, aperta o play no coração',
      'O novo lançamento tá tocando no Nil-Son!'
    ]
  },
  {
    id: 'track-1',
    title: 'Noite Estelar (VIP Mix)',
    artist: 'Luna Solaris & Kairos',
    artistId: 'artist-1',
    album: 'Horizontes Infinitos EP',
    duration: 194,
    durationFormatted: '3:14',
    // Public high quality royalty-free test audio
    audioUrl: 'https://cdn.freesound.org/previews/612/612604_5674468-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 48920,
    playsCount: 231500,
    releaseDate: 'Hoje',
    genre: 'Afrobeat',
    isPromoted: false,
    promoTagline: 'LANÇAMENTO EXCLUSIVO DA SEMANA • ÁUDIO EM ALTA DEFINIÇÃO',
    promoBannerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1400&auto=format&fit=crop&q=80',
    isTrending: true,
    filesize: '7.8 MB',
    bitrate: '320 kbps',
    bpm: 124,
    lyrics: [
      'Sob as luzes da cidade infinita',
      'Ouvindo o eco que no peito palpita',
      'Correndo contra o tempo e a gravidade',
      'Nossa frequência é pura liberdade',
      '(Refrão)',
      'Noite estelar, me leve além',
      'Onde o som não deve nada a ninguém',
      'Noite estelar, brilho no ar',
      'Essa vibe nunca vai acabar'
    ]
  },
  {
    id: 'track-2',
    title: 'Ritmo da Quebrada 011',
    artist: 'MC Vinn & DJ Zeca',
    artistId: 'artist-2',
    album: 'Frequência SP',
    duration: 168,
    durationFormatted: '2:48',
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 82400,
    playsCount: 412000,
    releaseDate: 'Há 2 dias',
    genre: 'Kuduro',
    isTrending: true,
    filesize: '6.4 MB',
    bitrate: '320 kbps',
    bpm: 130,
    lyrics: [
      'Grave bate forte na caixa de som',
      'Mandando a rima no compasso do dom',
      'Da zona sul pro mundo inteiro escutar',
      'Chegou pesado, ninguém vai segurar'
    ]
  },
  {
    id: 'track-3',
    title: 'Aurora Boreal',
    artist: 'Beatmaster Alex',
    artistId: 'artist-3',
    album: 'Neon Dreams',
    duration: 215,
    durationFormatted: '3:35',
    audioUrl: 'https://cdn.freesound.org/previews/653/653063_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 35120,
    playsCount: 180400,
    releaseDate: 'Há 3 dias',
    genre: 'Afrohouse',
    isTrending: true,
    filesize: '8.5 MB',
    bitrate: '320 kbps',
    bpm: 122,
    lyrics: [
      'Feel the wave taking over the night',
      'Dancing beneath the aurora light',
      'Lost in the melody, floating away',
      'Until the breaking of the day'
    ]
  },
  {
    id: 'track-4',
    title: 'Café & Nostalgia',
    artist: 'Mariana Duarte',
    artistId: 'artist-4',
    album: 'Tardes de Domingo',
    duration: 202,
    durationFormatted: '3:22',
    audioUrl: 'https://cdn.freesound.org/previews/612/612604_5674468-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 29800,
    playsCount: 145000,
    releaseDate: 'Há 5 dias',
    genre: 'Semba',
    filesize: '7.9 MB',
    bitrate: '320 kbps',
    bpm: 88,
    lyrics: [
      'A chuva lá fora molha a calçada',
      'O violão toca uma nota afinada',
      'Café bem quente e um bom pensamento',
      'Levando a vida leve com o vento'
    ]
  },
  {
    id: 'track-5',
    title: 'Cyberpunk Odyssey',
    artist: 'SynthWave Pulse',
    artistId: 'artist-5',
    album: 'Neo Tokyo 2099',
    duration: 240,
    durationFormatted: '4:00',
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 54300,
    playsCount: 298700,
    releaseDate: '1 semana atrás',
    genre: 'R&B / Soul',
    isTrending: true,
    filesize: '9.6 MB',
    bitrate: '320 kbps',
    bpm: 118,
    lyrics: [
      'Neon streets and endless rain',
      'Driving fast through analog pain',
      'Synthesizers screaming in the dark',
      'Igniting the future with a single spark'
    ]
  },
  {
    id: 'track-6',
    title: 'Pôr do Sol em Ipanema',
    artist: 'Bossa Nova Trio',
    artistId: 'artist-6',
    album: 'Vibes Tropicais',
    duration: 185,
    durationFormatted: '3:05',
    audioUrl: 'https://cdn.freesound.org/previews/653/653063_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 21900,
    playsCount: 98000,
    releaseDate: '2 semanas atrás',
    genre: 'Kizomba',
    filesize: '7.2 MB',
    bitrate: '320 kbps',
    bpm: 95,
    lyrics: [
      'Ondas mansas a beijar a areia',
      'A brisa suave que nos passeia',
      'Violão sereno e um tom de mar',
      'Como é lindo aqui descansar'
    ]
  },
  {
    id: 'track-7',
    title: 'Coração de Asfalto (Trap Brabo)',
    artist: 'Young Koba',
    artistId: 'artist-7',
    album: 'Voz da Cidade',
    duration: 178,
    durationFormatted: '2:58',
    audioUrl: 'https://cdn.freesound.org/previews/612/612604_5674468-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 67200,
    playsCount: 340900,
    releaseDate: '3 semanas atrás',
    genre: 'Trap / New School',
    filesize: '6.9 MB',
    bitrate: '320 kbps',
    bpm: 140,
    lyrics: [
      'Subi cada degrau sem atalho',
      'Orgulho e suor no meu trabalho',
      'O mic ligado é a minha munição',
      'Nil-Son tocando no paredão'
    ]
  },
  {
    id: 'track-8',
    title: 'Electric Euphoria',
    artist: 'Nova & The Sparks',
    artistId: 'artist-8',
    album: 'Festival Anthem 2026',
    duration: 210,
    durationFormatted: '3:30',
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    downloadsCount: 76500,
    playsCount: 512000,
    releaseDate: '1 mês atrás',
    genre: 'Kuduro',
    isTrending: true,
    filesize: '8.4 MB',
    bitrate: '320 kbps',
    bpm: 126,
    lyrics: [
      'Lights are flashing everywhere',
      'Hands up high into the air',
      'Feel the bass vibrate your soul',
      'Tonight we lose all control'
    ]
  }
];

export const FEATURED_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Luna Solaris & Kairos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 1850000,
    totalDownloads: 340000,
    bio: 'Duo pioneiro combinando batidas envolventes de Afrobeat e Afrohouse com vocais envolventes.',
    verified: true,
    genres: ['Afrobeat', 'Afrohouse']
  },
  {
    id: 'artist-2',
    name: 'MC Vinn & DJ Zeca',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 2400000,
    totalDownloads: 680000,
    bio: 'Referência em Kuduro pesado e batidas energéticas, colecionando milhões de downloads no Nil-Son.',
    verified: true,
    genres: ['Kuduro', 'Trap / New School']
  },
  {
    id: 'artist-3',
    name: 'Beatmaster Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 920000,
    totalDownloads: 210000,
    bio: 'Produtor musical focado em melodias contagiantes de Afrohouse e batidas tropicais pulsantes.',
    verified: true,
    genres: ['Afrohouse', 'Kuduro']
  },
  {
    id: 'artist-4',
    name: 'Mariana Duarte',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 780000,
    totalDownloads: 190000,
    bio: 'Cantora e compositora de Semba tradicional e Kizomba acústica com letras poéticas e arranjos marcantes.',
    verified: true,
    genres: ['Semba', 'Kizomba']
  },
  {
    id: 'artist-7',
    name: 'Young Koba',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 1200000,
    totalDownloads: 450000,
    bio: 'Líder da nova cena Trap / New School com flow afiado e batidas 808 pesadas.',
    verified: true,
    genres: ['Trap / New School', 'Rap']
  },
  {
    id: 'artist-guedes-rodrigues',
    name: 'Guedes Rodrigues',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 1650000,
    totalDownloads: 390000,
    bio: 'Compositor e intérprete, trazendo lançamentos autênticos com batidas profundas e rimas expressivas na plataforma Nil-Son.',
    verified: true,
    genres: ['Rap', 'Trap / New School']
  }
];

export const GENRES_LIST: GenreCategory[] = [
  {
    id: 'rap',
    name: 'Rap',
    color: '#E13300',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    trackCount: 48
  },
  {
    id: 'kuduro',
    name: 'Kuduro',
    color: '#E59A38',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    trackCount: 52
  },
  {
    id: 'kizomba',
    name: 'Kizomba',
    color: '#8D67AB',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    trackCount: 42
  },
  {
    id: 'semba',
    name: 'Semba',
    color: '#D84B16',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    trackCount: 36
  },
  {
    id: 'afrohouse',
    name: 'Afrohouse',
    color: '#1E3264',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    trackCount: 58
  },
  {
    id: 'afrobeat',
    name: 'Afrobeat',
    color: '#27856A',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    trackCount: 45
  },
  {
    id: 'rnb-soul',
    name: 'R&B / Soul',
    color: '#B49BC7',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80',
    trackCount: 34
  },
  {
    id: 'trap-new-school',
    name: 'Trap / New School',
    color: '#7358FF',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    trackCount: 50
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    title: 'Top 50 Downloads Lusofonia',
    description: 'As faixas mais baixadas e tocadas da semana no Nil-Son.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    trackIds: ['track-guedes-demonios', 'track-2', 'track-8', 'track-7', 'track-1', 'track-5', 'track-3'],
    createdAt: '2026-09-01'
  },
  {
    id: 'pl-2',
    title: 'Lançamentos Promocionais',
    description: 'Faixas promovidas por artistas independentes e gravadoras parceiras.',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    trackIds: ['track-guedes-demonios', 'track-new-release', 'track-1', 'track-3', 'track-4'],
    createdAt: '2026-09-02'
  },
  {
    id: 'pl-3',
    title: 'Kuduro & Trap / New School',
    description: 'O melhor do Kuduro e Trap / New School com graves pesados.',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    trackIds: ['track-2', 'track-7', 'track-8'],
    createdAt: '2026-08-28'
  },
  {
    id: 'pl-4',
    title: 'Kizomba, Semba & Afrohouse',
    description: 'Batidas envolventes e melodias para dançar e curtir sem limites.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    trackIds: ['track-new-release', 'track-3', 'track-4', 'track-6'],
    createdAt: '2026-08-25'
  }
];
