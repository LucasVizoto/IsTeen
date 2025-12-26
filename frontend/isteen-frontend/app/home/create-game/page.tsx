'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Note que removemos CreateGameData da importação pois usaremos FormData nativo
import { createGame, COOKIE_NAME } from '@/api/api'; 
import { parseCookies } from 'nookies';
import { jwtDecode } from "jwt-decode";
import Link from 'next/link';

// Adicionei o ícone 'Upload'
import { 
  Gamepad2, Calendar, Link as LinkIcon, Image as ImageIcon, 
  Code2, AlignLeft, Save, X, Loader2, ShieldAlert, Upload 
} from 'lucide-react';

import SuccessModal from '@/components/SuccessModal';

interface TokenPayload {
  role: string;
}

export default function CreateGamePage() {
  const router = useRouter();
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    game_name: '',
    developer: '',
    release_date: '',
    url_game: '',
    url_image_game: '', // Mantemos caso ele queira usar URL
    game_description: ''
  });

  // Novo estado para o arquivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. Proteção de Rota
  useEffect(() => {
    const { [COOKIE_NAME]: token } = parseCookies();
    if (!token) { router.push('/login'); return; }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role !== 'ADMIN') router.push('/home');
      else setIsAuthorized(true);
    } catch (err) { router.push('/login'); }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler específico para o arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Opcional: Limpar o campo de URL se o usuário selecionar um arquivo para evitar confusão visual
      setFormData(prev => ({ ...prev, url_image_game: '' }));
    }
  };

  // Submit atualizado para FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const dataToSend = new FormData();

      // Adiciona os campos de texto
      dataToSend.append('game_name', formData.game_name);
      dataToSend.append('developer', formData.developer);
      dataToSend.append('url_game', formData.url_game);
      dataToSend.append('game_description', formData.game_description);
      
      // Data ISO
      dataToSend.append('release_date', new Date(formData.release_date).toISOString());

      // Lógica da Imagem: Prioriza Arquivo, senão usa URL
      if (selectedFile) {
        // 'image_file' deve ser o nome do campo que o Multer/Backend espera
        dataToSend.append('image_file', selectedFile); 
      } else if (formData.url_image_game) {
        dataToSend.append('url_image_game', formData.url_image_game);
      }

      await createGame(dataToSend);
      
      setShowSuccessModal(true);
      setTimeout(() => { router.push('/home'); }, 2000);

    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erro ao criar o jogo.';
      setError(msg);
      setIsLoading(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      <SuccessModal isOpen={showSuccessModal} title="Jogo Criado!" message={`"${formData.game_name}" foi adicionado.`} />
      <div className="inset-0 bg-[#0a0a0f]/85 z-0 fixed"></div>

      <div className="relative z-10 w-full max-w-4xl bg-[#121726]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-white/5 p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
              <Gamepad2 className="text-neon-pink" size={32} /> Novo Jogo
            </h1>
          </div>
          <Link href="/home" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"><X size={24} /></Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
              <ShieldAlert size={20} /> <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna 1 */}
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">Nome do Jogo</label>
                <div className="relative">
                  <input 
                  type="text" 
                  name="game_name" 
                  required value={formData.game_name} 
                  onChange={handleChange} 
                  placeholder= 'Ex: Space Invaders'
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all" />
                  <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">Desenvolvedora</label>
                <div className="relative">
                  <input 
                  type="text" 
                  name="developer" 
                  required value={formData.developer} 
                  onChange={handleChange} 
                  placeholder= 'Ex: Taito Corporation'
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all" />
                  <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">Data de Lançamento</label>
                <div className="relative">
                  <input 
                  type="date" 
                  name="release_date" 
                  required value={formData.release_date} 
                  onChange={handleChange} 
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all [color-scheme:dark]" />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                </div>
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">URL do Site/Jogo</label>
                <div className="relative">
                  <input 
                  type="url" 
                  name="url_game" 
                  required value={formData.url_game} 
                  onChange={handleChange} 
                  placeholder="Ex: https://..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all" />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                </div>
              </div>

              {/* --- BLOCO DE IMAGEM --- */}
              <div className="group">
                <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">Imagem de Capa</label>
                
                {/* 1. Input de URL */}
                <div className="relative mb-3">
                  <input 
                    type="url" name="url_image_game" 
                    // Desabilita URL se tiver arquivo selecionado para não confundir
                    disabled={!!selectedFile}
                    value={formData.url_image_game} onChange={handleChange}
                    placeholder="Ex: https://..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all disabled:opacity-50"
                  />
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                </div>

                {/* Divisor "OU" Estilizado */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-[10px] text-white/40 uppercase font-bold">OU envie um arquivo</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* 2. Input de Arquivo Customizado */}
                <div className="relative">
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`
                      flex items-center justify-center gap-3 w-full py-3 px-4 
                      rounded-xl border border-dashed cursor-pointer transition-all
                      ${selectedFile 
                        ? 'bg-neon-pink/10 border-neon-pink text-white' 
                        : 'bg-black/20 border-white/20 text-white/50 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <Upload size={18} />
                    <span className="text-sm truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : "Clique para selecionar imagem"}
                    </span>
                  </label>
                  
                  {/* Botão para limpar arquivo selecionado */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      title="Remover arquivo"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              {/* --- FIM BLOCO DE IMAGEM --- */}

            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2 ml-1">Descrição</label>
            <div className="relative">
              <textarea 
              name="game_description" 
              required rows={4} 
              value={formData.game_description} 
              onChange={handleChange} 
              placeholder='Sinopse ou detalhes sobre o jogo...'
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-pink focus:ring-1 focus:ring-neon-pink outline-none transition-all resize-none" />
              <AlignLeft className="absolute left-3 top-6 text-white/30" size={18} />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
            <Link href="/home" className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-semibold">Cancelar</Link>
            <button type="submit" disabled={isLoading} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-wider bg-neon-pink text-white hover:bg-pink-600 hover:shadow-[0_0_20px_rgba(255,105,180,0.4)] transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} {isLoading ? 'Salvando...' : 'Salvar Jogo'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}