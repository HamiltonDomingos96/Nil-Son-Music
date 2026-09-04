import React, { useState } from 'react';
import { 
  X, 
  User, 
  Music, 
  Lock, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ExternalLink,
  Link2
} from 'lucide-react';
import { UserSession, UserRole } from '../types';
import { syncUserToFirebase } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: UserSession, isNewRegistration?: boolean) => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}

const ARTIST_GENRES = [
  'Rap/Trap',
  'Kuduro',
  'Kizomba',
  'Semba',
  'Afro House',
  'Afrobeat',
  'R&B',
  'Drill'
];

const WHATSAPP_SUPPORT_NUMBER = '244948352425';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
  initialRole = 'listener'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isArtist, setIsArtist] = useState<boolean>(initialRole === 'artist');
  
  // Register fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [genre, setGenre] = useState(ARTIST_GENRES[0]);
  const [socialLink, setSocialLink] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status & Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const trimmedName = name.trim();
    const trimmedPass = password.trim();
    const trimmedWa = whatsapp.trim();
    const trimmedSocial = socialLink.trim();

    if (!trimmedName) {
      setErrorMsg(isArtist ? 'Por favor, insira o seu Nome Artístico / Nome de Palco.' : 'Por favor, insira o seu Nome Completo.');
      return;
    }

    if (!trimmedPass) {
      setErrorMsg('Por favor, defina uma palavra-passe (mínimo 4 dígitos).');
      return;
    }

    if (trimmedPass.length < 4) {
      setErrorMsg('A palavra-passe deve ter pelo menos 4 caracteres.');
      return;
    }

    if (isArtist && !trimmedWa) {
      setErrorMsg('O número de WhatsApp / Booking é obrigatório para o Perfil de Artista.');
      return;
    }

    setIsLoading(true);

    const role: UserRole = isArtist ? 'artist' : 'listener';
    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newSession: UserSession = {
      id: userId,
      name: trimmedName,
      role,
      genre: isArtist ? genre : undefined,
      whatsapp: trimmedWa || undefined,
      socialLink: isArtist && trimmedSocial ? trimmedSocial : undefined,
      registeredAt: new Date().toISOString()
    };

    // 1. Guardar a sessão do utilizador localmente (LocalStorage)
    try {
      localStorage.setItem('user_session', JSON.stringify(newSession));
      
      // Também guarda no registro local de contas para login futuro
      const storedUsersRaw = localStorage.getItem('portal_nilson_users');
      const usersList: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      usersList.push({
        ...newSession,
        password: trimmedPass
      });
      localStorage.setItem('portal_nilson_users', JSON.stringify(usersList));
    } catch (err) {
      console.warn('Erro ao salvar no localStorage:', err);
    }

    // 2. Sincronizar em tempo real com o Firebase Realtime Database
    syncUserToFirebase(newSession).catch(err => {
      console.warn('Sync Firebase aviso:', err);
    });

    // 3. Formatar mensagem limpa e estruturada para WhatsApp (integração wa.me)
    let messageText = '';
    if (isArtist) {
      messageText = 
`🎤 *SOLICITAÇÃO DE PERFIL DE ARTISTA - PORTAL NILSON*
• Nome Artístico: ${trimmedName}
• Género Musical: ${genre}
• Contacto/Booking: ${trimmedWa || 'Não informado'}
• Redes Sociais: ${trimmedSocial || 'Não informado'}`;
    } else {
      messageText = 
`📌 *NOVO CADASTRO DE OUVINTE - PORTAL NILSON*
• Nome: ${trimmedName}
• WhatsApp: ${trimmedWa || 'Não informado'}`;
    }

    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodedText}`;

    // 4. Notificar sucesso no app
    onAuthSuccess(newSession, true);

    // 5. Redirecionar para o WhatsApp oficial via wa.me
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
      onClose();
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedIdent = loginIdentifier.trim();
    const trimmedPass = loginPassword.trim();

    if (!trimmedIdent) {
      setErrorMsg('Por favor, informe seu Nome Completo, Nome Artístico ou WhatsApp.');
      return;
    }

    if (!trimmedPass) {
      setErrorMsg('Por favor, insira a sua palavra-passe.');
      return;
    }

    setIsLoading(true);

    try {
      const storedUsersRaw = localStorage.getItem('portal_nilson_users');
      const usersList: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Procura o usuário cadastrado
      const foundUser = usersList.find((u) => {
        const matchName = u.name?.toLowerCase() === trimmedIdent.toLowerCase();
        const matchPhone = u.whatsapp && u.whatsapp.replace(/\D/g, '').includes(trimmedIdent.replace(/\D/g, ''));
        return matchName || matchPhone;
      });

      if (foundUser) {
        if (foundUser.password && foundUser.password !== trimmedPass) {
          setErrorMsg('Palavra-passe incorreta. Verifique e tente novamente.');
          setIsLoading(false);
          return;
        }

        const session: UserSession = {
          id: foundUser.id,
          name: foundUser.name,
          role: foundUser.role || 'listener',
          genre: foundUser.genre,
          whatsapp: foundUser.whatsapp,
          registeredAt: foundUser.registeredAt || new Date().toISOString()
        };

        localStorage.setItem('user_session', JSON.stringify(session));
        onAuthSuccess(session, false);
        setIsLoading(false);
        onClose();
        return;
      }

      // Se não encontrou nas contas salvas, cria uma sessão de acesso direto
      const isArtistGuess = trimmedIdent.toLowerCase().includes('mc') || trimmedIdent.toLowerCase().includes('dj');
      const session: UserSession = {
        id: 'usr_' + Date.now().toString(36),
        name: trimmedIdent,
        role: isArtistGuess ? 'artist' : 'listener',
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('user_session', JSON.stringify(session));
      onAuthSuccess(session, false);
      setIsLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao processar o login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="modal-auth-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="modal-auth-container"
        className="w-full max-w-md bg-[#18110b] border border-[#332216] rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-[#fdfaf6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Portal Nil-Son Brand */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#291b11] bg-gradient-to-b from-[#25170f] to-[#18110b]">
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#a89383] hover:text-[#fdfaf6] hover:bg-[#332216] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] flex items-center justify-center text-[#120d09] shadow-md">
              <Radio className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#fdfaf6] flex items-center gap-2">
                Portal Nil-<span className="text-[#e59a38]">Son</span>
              </h2>
              <p className="text-xs text-[#bda998]">Música, Promoção & Downloads Oficiais</p>
            </div>
          </div>

          {/* Mode Tabs: Entrar vs Criar Conta */}
          <div className="flex mt-4 p-1 bg-[#120d09] rounded-xl border border-[#2b1c12]">
            <button
              id="tab-auth-register"
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#e59a38] text-[#120d09] shadow-md'
                  : 'text-[#a89383] hover:text-[#fdfaf6]'
              }`}
            >
              Criar Nova Conta
            </button>
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#e59a38] text-[#120d09] shadow-md'
                  : 'text-[#a89383] hover:text-[#fdfaf6]'
              }`}
            >
              Já tenho Conta
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {errorMsg && (
            <div 
              id="auth-error-alert"
              className="mb-5 p-3.5 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-200 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'register' ? (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-5" id="form-register-user">
              {/* Question: ÉS ARTISTA? */}
              <div className="bg-[#120d09] p-4 rounded-xl border border-[#2e1d13]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e59a38] mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#e59a38]" />
                  <span>❓ ÉS ARTISTA?</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Option NÃO: Ouvinte */}
                  <button
                    id="btn-role-listener"
                    type="button"
                    onClick={() => { setIsArtist(false); setErrorMsg(null); }}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      !isArtist
                        ? 'bg-[#281a12] border-[#e59a38] text-[#fdfaf6] ring-1 ring-[#e59a38]/40 shadow'
                        : 'bg-[#18100a] border-[#2c1c13] text-[#a89383] hover:border-[#3d271a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <User className="w-4 h-4 text-[#a89383]" />
                        <span>NÃO</span>
                      </div>
                      {!isArtist && <CheckCircle2 className="w-4 h-4 text-[#e59a38]" />}
                    </div>
                    <span className="text-[11px] text-[#9c8777]">Usuário / Ouvinte</span>
                  </button>

                  {/* Option SIM: Artista */}
                  <button
                    id="btn-role-artist"
                    type="button"
                    onClick={() => { setIsArtist(true); setErrorMsg(null); }}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      isArtist
                        ? 'bg-[#281a12] border-[#e59a38] text-[#fdfaf6] ring-1 ring-[#e59a38]/40 shadow'
                        : 'bg-[#18100a] border-[#2c1c13] text-[#a89383] hover:border-[#3d271a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Music className="w-4 h-4 text-[#e59a38]" />
                        <span>SIM</span>
                      </div>
                      {isArtist && <CheckCircle2 className="w-4 h-4 text-[#e59a38]" />}
                    </div>
                    <span className="text-[11px] text-[#9c8777]">Perfil de Artista</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Fields based on Role */}
              {!isArtist ? (
                /* 🅰️ OUVINTE / USUÁRIO NORMAL */
                <div className="space-y-4 animate-fadeIn" id="fields-listener">
                  {/* 1. Nome Completo */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Nome Completo <span className="text-[#e59a38]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-listener-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Pedro Domingos"
                        required
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Palavra-passe */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Palavra-passe (Password) <span className="text-[#e59a38]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-listener-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        required
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89383] hover:text-[#fdfaf6]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 3. Número de WhatsApp (opcional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#ded0c5]">
                        Número de WhatsApp
                      </label>
                      <span className="text-[10px] text-[#a89383] bg-[#22160f] px-2 py-0.5 rounded">Opcional</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-listener-whatsapp"
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+244 9XX XXX XXX"
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#9c8777] mt-1">
                      Usado para suporte e novidades exclusivas de lançamentos.
                    </p>
                  </div>
                </div>
              ) : (
                /* 🅱️ PERFIL DE ARTISTA */
                <div className="space-y-4 animate-fadeIn" id="fields-artist">
                  {/* 1. Nome Artístico */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Nome Artístico <span className="text-[#e59a38]">*</span>
                    </label>
                    <div className="relative">
                      <Music className="w-4 h-4 text-[#e59a38] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-artist-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: MC Prodigio, Guedes Rodrigues..."
                        required
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Género Musical Principal */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Género Musical Principal <span className="text-[#e59a38]">*</span>
                    </label>
                    <select
                      id="select-artist-genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl px-3.5 py-2.5 text-sm text-[#fdfaf6] outline-none transition-colors"
                    >
                      {ARTIST_GENRES.map((g) => (
                        <option key={g} value={g} className="bg-[#18110b] text-[#fdfaf6]">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Palavra-passe */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Palavra-passe (Password) <span className="text-[#e59a38]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-artist-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        required
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89383] hover:text-[#fdfaf6]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 4. Número de WhatsApp / Booking (Obrigatório) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#ded0c5]">
                        Número de WhatsApp / Booking <span className="text-[#e59a38]">*</span>
                      </label>
                      <span className="text-[10px] text-[#e59a38] bg-[#e59a38]/15 px-2 py-0.5 rounded font-bold">Obrigatório</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#e59a38] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-artist-whatsapp"
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+244 9XX XXX XXX"
                        required
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#9c8777] mt-1">
                      Necessário para validação de perfil de artista e liberação de uploads.
                    </p>
                  </div>

                  {/* 5. Link do Perfil de Redes Sociais */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                      Link do Perfil de Redes Sociais (Instagram, Facebook ou YouTube)
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-artist-social"
                        type="url"
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        placeholder="https://instagram.com/seunome ou youtube.com/..."
                        className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-[#9c8777] mt-1">
                      Ajuda nossa equipa a verificar a sua identidade artística.
                    </p>
                  </div>
                </div>
              )}

              {/* Notice sobre WhatsApp Oficial */}
              <div className="p-3 bg-[#1e140d] border border-[#332216] rounded-xl text-[11px] text-[#c2ada0] flex items-center gap-2.5">
                <span className="text-base">📲</span>
                <p>
                  Ao finalizar, seus dados serão guardados e enviados diretamente para o WhatsApp oficial de suporte do Portal Nil-Son (<strong>+244 948 352 425</strong>).
                </p>
              </div>

              {/* Botão FINALIZAR CADASTRO */}
              <button
                id="btn-submit-register"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#e59a38] to-[#f5a746] hover:from-[#f5a746] hover:to-[#e59a38] text-[#120d09] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>A processar cadastro...</span>
                ) : (
                  <>
                    <span>FINALIZAR CADASTRO</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4" id="form-login-user">
              <div>
                <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                  Nome Completo, Nome Artístico ou WhatsApp
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-identifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Seu nome ou número cadastrado"
                    required
                    className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ded0c5] mb-1.5">
                  Palavra-passe (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#a89383] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua palavra-passe"
                    required
                    className="w-full bg-[#120d09] border border-[#2e1d13] focus:border-[#e59a38] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#fdfaf6] placeholder-[#7d695b] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89383] hover:text-[#fdfaf6]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#e59a38] hover:bg-[#f5a746] text-[#120d09] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
                >
                  {isLoading ? <span>A verificar...</span> : <span>ENTRAR NO NIL-SON</span>}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-xs text-[#a89383] hover:text-[#e59a38] transition-colors"
                >
                  Ainda não tem conta? <span className="font-bold underline text-[#e59a38]">Cadastre-se aqui</span>
                </button>
              </div>
            </form>
          )}

          {/* Direct WhatsApp Contact Footer */}
          <div className="mt-6 pt-4 border-t border-[#291b11] flex items-center justify-between text-[11px] text-[#a89383]">
            <span>Suporte Oficial WhatsApp:</span>
            <a 
              href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e59a38] hover:underline flex items-center gap-1 font-bold"
            >
              <span>+244 948 352 425</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
