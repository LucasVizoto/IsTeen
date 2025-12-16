'use client';

import Link from 'next/link';
import { Mail, Lock } from 'lucide-react'; // Importando os ícones

export default function LoginPage() {
  return (
    // Container Principal com a Imagem de Fundo
    // Certifique-se de que 'fundo-retro-wave.png' esteja na sua pasta 'public'
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      {/* Overlay escuro para garantir leitura em cima da imagem de fundo */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Cartão de Login (Glassmorphism) */}
      <div className="
        relative z-10 
        w-full max-w-[450px] 
        bg-white/10           /* Fundo branco super transparente */
        backdrop-blur-lg      /* Desfoque forte no fundo */
        border border-white/20 /* Borda fina e sutil */
        rounded-3xl           /* Bordas bem arredondadas */
        p-8 sm:p-12 
        text-white
        box-shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] /* Sombra suave para destacar */
      ">
        
        <h2 className="text-4xl font-bold text-center mb-10 tracking-tight">
          Login
        </h2>

        {/* Formulário */}
        <form className="flex flex-col space-y-6">
          
          {/* Campo de Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <input 
                type="email" 
                id="email"
                placeholder="Seu email"
                className="
                  w-full 
                  bg-transparent 
                  border-b border-white/50 focus:border-white 
                  outline-none 
                  py-2 pr-10 pl-1
                  placeholder-white/50
                  transition-colors
                "
              />
              {/* Ícone de Email posicionado absolutamente à direita */}
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
                type="password" 
                id="password"
                placeholder="Sua senha"
                className="
                  w-full 
                  bg-transparent 
                  border-b border-white/50 focus:border-white 
                  outline-none 
                  py-2 pr-10 pl-1
                  placeholder-white/50
                  transition-colors
                "
              />
              {/* Ícone de Cadeado posicionado absolutamente à direita */}
              <Lock className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
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
                  accent-white /* Tenta pintar o checkbox nativo de branco */
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
            className="
              w-full 
              py-3.5 
              mt-6
              bg-white text-gray-900 
              font-bold text-lg
              rounded-full 
              hover:bg-gray-100 
              transition-colors duration-300
              shadow-lg
            "
          >
            Logar
          </button>
        </form>

        {/* Rodapé - Registrar */}
        <div className="text-center mt-8 text-sm">
          <span className="opacity-80">Não tem uma conta? </span>
          <Link href="registro" className="font-bold hover:underline ml-1">
            Registre-se
          </Link>
        </div>

      </div>
    </main>
  );
}