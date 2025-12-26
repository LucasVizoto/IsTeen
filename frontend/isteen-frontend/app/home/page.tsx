'use client';

import { useState, useEffect, useCallback } from 'react';
import { listGames, Game, COOKIE_NAME } from '@/api/api';
// Importação do jwt-decode e nookies
import { jwtDecode } from "jwt-decode"; 
import { parseCookies } from 'nookies';

// Adicionei o ícone Plus para o botão de criar
import { Search, Calendar, Code2, Gamepad2, Loader2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

// Interface para o Payload do seu Token (ajuste conforme seu backend)
interface TokenPayload {
  sub: string;
  role: string; // ou 'roles': string[]
  exp: number;
}

export default function GamesDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Novo estado para controlar permissão
  const [isAdmin, setIsAdmin] = useState(false);

  // --- 1. VERIFICAÇÃO DE ROLE (ADMIN) ---
  useEffect(() => {
    const { [COOKIE_NAME]: token } = parseCookies();
    
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        // Verifica se a role é ADMIN (ajuste a string conforme seu banco: 'ADMIN', 'admin', 'administrator')
        if (decoded.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, []);

  const fetchGames = useCallback(async (query: string, pageNumber: number) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await listGames(query, pageNumber);
      const newGames = response.data.games || [];
      setGames(newGames);
      if (newGames.length < 20) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar a biblioteca de jogos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchGames(searchTerm, 1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchGames]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    fetchGames(searchTerm, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <main 
      className="min-h-screen w-full p-4 sm:p-8 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      <div className="inset-0 bg-[#0a0a0f]/80 z-0 fixed"></div>

      <div className="relative z-10 max-w-7xl mx-auto pb-10">
        
        {/* --- CABEÇALHO --- */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Biblioteca
            </h1>
            <p className="text-neon-cyan mt-2 font-mono text-sm">
              // Escolha sua próxima aventura
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            
            {/* Input de Busca */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isLoading ? (
                  <Loader2 className="text-neon-pink animate-spin" size={20} />
                ) : (
                  <Search className="text-white/50 group-focus-within:text-neon-cyan transition-colors" size={20} />
                )}
              </div>
              <input
                type="text"
                placeholder="Buscar jogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-3 
                  bg-white/5 border border-white/20 rounded-full 
                  text-white placeholder-white/40 
                  focus:outline-none focus:border-neon-cyan focus:bg-white/10
                  transition-all duration-300 backdrop-blur-sm
                "
              />
            </div>

            {/* --- BOTÃO DE CRIAR JOGO (ADMIN ONLY) --- */}
            {isAdmin && (
              <Link 
                href="/home/create-game" // Rota para criação (você criará essa página depois)
                className="
                  flex items-center gap-2 
                  px-6 py-3 
                  bg-neon-pink/20 border border-neon-pink text-neon-pink 
                  rounded-full font-bold uppercase tracking-wider text-sm
                  hover:bg-neon-pink hover:text-white hover:shadow-[0_0_20px_rgba(255,105,180,0.6)]
                  transition-all duration-300
                  whitespace-nowrap
                "
              >
                <Plus size={20} />
                Novo Jogo
              </Link>
            )}

          </div>
        </header>

        {/* ... (Resto do código: Listagem, Erros, Loading e Paginação mantidos iguais) ... */}
        {error && (
          <div className="text-center p-4 mb-8 border border-red-500/50 bg-red-900/20 rounded-xl backdrop-blur-md">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        )}

        {isLoading && games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/70">
            <Loader2 size={48} className="animate-spin text-neon-pink mb-4" />
            <p className="animate-pulse tracking-widest">CARREGANDO DADOS...</p>
          </div>
        ) : (
          <>
            {games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <div key={game.id} className="group relative bg-[#151525]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,105,180,0.4)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden bg-black/50">
                      <div className="absolute inset-0 bg-neon-pink/0 group-hover:bg-neon-pink/10 transition-colors z-10 duration-300"></div>
                      <img 
                        src={game.url_image_game} 
                        alt={game.game_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { const target = e.target as HTMLImageElement; target.src = 'https://placehold.co/600x400/151525/FFF?text=No+Image'; }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent z-20">
                        <div className="flex items-center gap-1 text-[10px] text-neon-cyan font-mono uppercase tracking-wider">
                          <Code2 size={12} />
                          <span className="truncate">{game.developer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors line-clamp-1">{game.game_name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{game.game_description}</p>
                      <div className="flex items-center gap-2 text-xs text-white/50 mb-4 font-mono">
                        <Calendar size={12} />
                        <span>{formatDate(game.release_date)}</span>
                      </div>
                      <Link href={game.url_game} target="_blank" className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 border border-white/20 text-white font-semibold text-sm rounded-lg hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all duration-300 uppercase tracking-wide">
                        <Gamepad2 size={16} />
                        Jogar Agora
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-white/5 p-6 rounded-full mb-4"><Search size={40} className="text-white/30" /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Nenhum resultado</h3>
                  <p className="text-gray-400">Tente buscar por outro termo.</p>
                </div>
              )
            )}
            
            {/* Paginação */}
            {games.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-6">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || isLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 transition-all duration-300 ${page === 1 ? 'border-white/10 text-white/30 cursor-not-allowed' : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]'}`}>
                  <ChevronLeft size={20} /> Anterior
                </button>
                <div className="font-mono text-white/80 bg-black/40 px-4 py-2 rounded-lg border border-white/10">Página <span className="text-neon-pink font-bold text-xl">{page}</span></div>
                <button onClick={() => handlePageChange(page + 1)} disabled={!hasMore || isLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 transition-all duration-300 ${!hasMore ? 'border-white/10 text-white/30 cursor-not-allowed' : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]'}`}>
                  Próximo <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}