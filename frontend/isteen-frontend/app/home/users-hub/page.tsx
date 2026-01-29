'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listUsers, sendMail, updateUserRole, COOKIE_NAME, FetchManyUsers } from '@/api/api'; 
import { parseCookies } from 'nookies';
import { jwtDecode } from "jwt-decode";
import Link from 'next/link';

import { 
  Users, Search, ChevronLeft, ChevronRight, 
  Loader2, ShieldAlert, Home, Mail, Calendar, Hash,
  Shield, ShieldCheck, X, Check
} from 'lucide-react';

interface TokenPayload {
  role: string;
}

// Extensão da interface User caso ela não tenha o campo role explicitamente tipado ainda
interface UserWithRole extends FetchManyUsers {
  role: 'ADMIN' | 'MEMBER';
}

export default function UsersPage() {
  const router = useRouter();
  
  // Estados
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Estados para o Modal de Confirmação
  const [userToPromote, setUserToPromote] = useState<UserWithRole | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

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

  // 2. Busca
  useEffect(() => {
    if (!isAuthorized) return;
    const delayDebounceFn = setTimeout(() => { fetchUsers(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, isAuthorized]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await listUsers(searchTerm, page);
      setUsers((response.data.users || []) as UserWithRole[]); 
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Função de Promoção
  const handlePromoteUser = async () => {
    if (!userToPromote) return;
    setIsPromoting(true);
    try {
      await updateUserRole(userToPromote.id);

      await sendMail({
        to: userToPromote.email,
      })
      
      // Atualiza a lista localmente para refletir a mudança sem recarregar tudo
      setUsers(prev => prev.map(u => 
        u.id === userToPromote.id ? { ...u, role: 'ADMIN' } : u
      ));
      
      setUserToPromote(null); // Fecha o modal
    } catch (error) {
      console.log("Erro ao promover usuário", error);
      alert("Erro ao promover usuário. Tente novamente.");
    } finally {
      setIsPromoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };

  if (!isAuthorized) return null;

  return (
    <main 
      className="min-h-screen w-full p-4 sm:p-8 bg-cover bg-center bg-fixed relative flex flex-col items-center"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      <div className="inset-0 bg-[#0a0a0f]/90 z-0 fixed"></div>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      {userToPromote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(255,105,180,0.2)]">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-neon-pink" /> Confirmar Ação
            </h3>
            <p className="text-white/70 mb-6">
              Você tem certeza que deseja tornar <strong>{userToPromote.username}</strong> um Administrador? 
              <br/><span className="text-xs text-white/40">Isso dará acesso total ao sistema.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setUserToPromote(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handlePromoteUser}
                disabled={isPromoting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-pink text-white font-bold hover:bg-pink-600 transition-colors"
              >
                {isPromoting ? <Loader2 className="animate-spin" size={18}/> : <Check size={18}/>} Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-6xl space-y-6">
        
        {/* Header (Mantido igual) */}
        <div className="bg-[#121726]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neon-pink/10 rounded-xl border border-neon-pink/20">
              <Users className="text-neon-pink" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Gerenciar Usuários</h1>
              <p className="text-white/40 text-sm">Visualização de cadastros do sistema</p>
            </div>
          </div>
          <div className="relative w-full md:w-96 group">
            <input 
              type="text" placeholder="Pesquisar..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-white/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon-cyan transition-colors" size={18} />
          </div>
          <Link href="/home" className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white border border-transparent hover:border-white/10"><Home size={20} /></Link>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-[#121726]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-white/50 gap-3">
              <Loader2 className="animate-spin text-neon-pink" size={40} />
              <p>Carregando dados...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-white/30 gap-3">
              <ShieldAlert size={40} />
              <p>Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-neon-cyan uppercase text-xs tracking-widest border-b border-white/10">
                    <th className="p-6 font-bold flex items-center gap-2"><Hash size={14}/> ID</th>
                    <th className="p-6 font-bold">Usuário</th>
                    <th className="p-6 font-bold"><Mail size={14} className="inline mr-1"/> Email</th>
                    <th className="p-6 font-bold text-right"><Calendar size={14} className="inline mr-1"/> Criado em</th>
                    <th className="p-6 font-bold text-center">Permissão</th> {/* Nova Coluna */}
                  </tr>
                </thead>
                <tbody className="text-white/80 divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6 font-mono text-xs text-white/40 group-hover:text-white/60 truncate max-w-[100px]">
                        {user.id}
                      </td>
                      <td className="p-6 font-semibold text-white">
                        {user.username}
                      </td>
                      <td className="p-6 text-white/70">
                        {user.email}
                      </td>
                      <td className="p-6 text-right font-mono text-sm text-neon-pink/80">
                        {formatDate(user.created_at || new Date().toISOString())}
                      </td>
                      
                      {/* --- COLUNA DE AÇÃO (ADMIN) --- */}
                      <td className="p-6 text-center">
                        {user.role === 'ADMIN' ? (
                          <div className="flex items-center justify-center gap-2 text-neon-green" title="Usuário já é Admin">
                            <ShieldCheck size={20} />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Admin</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setUserToPromote(user)}
                            className="group/btn flex items-center justify-center mx-auto p-2 rounded-lg hover:bg-neon-pink/10 transition-all text-white/30 hover:text-neon-pink"
                            title="Tornar Admin"
                          >
                            <Shield size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginação (Igual ao anterior) */}
        <div className="flex justify-between items-center bg-[#121726]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={18} /> Anterior
            </button>
            <span className="font-mono text-neon-cyan font-bold">Página {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={users.length === 0 || loading} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                Próxima <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </main>
  );
}