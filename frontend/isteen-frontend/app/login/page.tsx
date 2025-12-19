'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importações da API e Nookies
import { loginUser, COOKIE_NAME } from '@/api/api'; 
import { setCookie } from 'nookies';

// Ícones
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Estados
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handler de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handler de Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Chama a API de Login
      const response = await loginUser(formData);
      
      // 2. Extrai o token da resposta (ajuste conforme seu backend retorna: data.token ou data.access_token)
      const { token } = response.data; 

      if (!token) {
        throw new Error("Token não recebido do servidor.");
      }

      // 3. Salva o Token nos Cookies
      setCookie(null, COOKIE_NAME, token, {
        maxAge: 30 * 24 * 60 * 60, // 30 dias de validade
        path: '/', // Disponível em toda a aplicação
        // secure: process.env.NODE_ENV === 'production', // Descomente em produção (HTTPS)
      });

      // 4. Redireciona para a Home
      router.push('/home'); // Ajuste se sua rota for /dashboard

    } catch (error: any) {
      console.error('Erro de login:', error);
      // Pega mensagem do backend ou usa genérica
      const msg = error.response?.data?.message || 'Email ou senha incorretos.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Cartão de Login */}
      <div className="
        relative z-10 
        w-full max-w-[450px] 
        bg-white/10 
        backdrop-blur-lg 
        border border-white/20 
        rounded-3xl 
        p-8 sm:p-12 
        text-white
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      ">
        
        <h2 className="text-4xl font-bold text-center mb-6 tracking-tight">
          Login
        </h2>

        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="
            mb-6 p-4 rounded-xl 
            bg-red-600/40 border-2 border-red-400 
            flex items-center gap-3 text-sm text-white font-semibold 
            shadow-[0_0_15px_rgba(248,113,113,0.4)] backdrop-blur-md animate-in fade-in slide-in-from-top-2
          ">
            <AlertCircle size={20} className="text-red-200 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          
          {/* Campo de Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <input 
                type="email" 
                id="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu email"
                className="
                  w-full 
                  bg-transparent 
                  border-b border-white/50 focus:border-white 
                  outline-none 
                  py-2 pr-10 pl-1
                  placeholder-white/50
                  transition-colors
                  disabled:opacity-50
                "
              />
              <Mail className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            </div>
          </div>

          {/* Campo de Senha */}
          <div className="relative mt-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1 ml-1">
              Senha
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                className="
                  w-full 
                  bg-transparent 
                  border-b border-white/50 focus:border-white 
                  outline-none 
                  py-2 pr-10 pl-1
                  placeholder-white/50
                  transition-colors
                  disabled:opacity-50
                "
              />
              {/* Botão de Toggle Senha */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Lembre-me e Esqueci a Senha */}
          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="
                  w-4 h-4 
                  rounded 
                  border-white/50 bg-transparent 
                  text-white 
                  accent-white 
                  focus:ring-offset-0 focus:ring-1 focus:ring-white
                " 
              />
              <span>Lembre-me</span>
            </label>
            <Link href="#" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">
              Esqueci a senha
            </Link>
          </div>

          {/* Botão de Logar */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3.5 mt-6 
              bg-white text-gray-900 
              font-bold text-lg rounded-full 
              hover:bg-gray-100 hover:scale-[1.02]
              transition-all duration-300 shadow-lg
              flex items-center justify-center
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              "Logar"
            )}
          </button>
        </form>

        {/* Rodapé - Registrar */}
        <div className="text-center mt-8 text-sm">
          <span className="opacity-80">Não tem uma conta? </span>
          <Link href="/registro" className="font-bold hover:underline ml-1 hover:text-green-300 transition-colors">
            Registre-se
          </Link>
        </div>

      </div>
    </main>
  );
}