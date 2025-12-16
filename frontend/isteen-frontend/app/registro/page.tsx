'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Check, X } from 'lucide-react';

export default function RegisterPage() {
  // Estados para controlar os inputs e a visibilidade da senha
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para pontuação da senha (0 a 4)
  const [strengthScore, setStrengthScore] = useState(0);

  // Função para calcular a força da senha
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;

    if (pass.length >= 8) score += 1; // Pelo menos 8 caracteres
    if (/[0-9]/.test(pass)) score += 1; // Contém números
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1; // Contém símbolos
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1; // Maiúsculas e minúsculas

    return score;
  };

  // Handler de mudança no input de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setFormData({ ...formData, password: newPass });
    setStrengthScore(calculateStrength(newPass));
  };

  // Função auxiliar para cor da barra de força
  const getStrengthColor = () => {
    if (strengthScore === 0) return 'bg-white/20';
    if (strengthScore <= 2) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'; // Fraca
    if (strengthScore === 3) return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]'; // Média
    return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'; // Forte
  };

  // Texto descritivo da força
  const getStrengthText = () => {
    if (strengthScore === 0) return '';
    if (strengthScore <= 2) return 'Senha Fraca';
    if (strengthScore === 3) return 'Senha Média';
    return 'Senha Forte';
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="
        relative z-10 
        w-full max-w-[500px] 
        bg-white/10 
        backdrop-blur-lg 
        border border-white/20 
        rounded-3xl 
        p-8 sm:p-12 
        text-white
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
      ">
        
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 tracking-tight">
          Crie sua Conta
        </h2>
        <p className="text-center text-white/60 mb-8 text-sm">
          Junte-se à rede IsTeen OS v3.2
        </p>

        <form className="flex flex-col space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Nome de Usuário */}
          <div className="relative">
            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-widest mb-1 ml-1 text-white/70">
              Usuário
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="username"
                placeholder="Ex: CyberTeen"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors"
              />
              <User className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-1 ml-1 text-white/70">
              Email
            </label>
            <div className="relative">
              <input 
                type="email" 
                id="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors"
              />
              <Mail className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            </div>
          </div>

          {/* Senha */}
          <div className="relative">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest mb-1 ml-1 text-white/70">
              Senha
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="Crie uma senha forte"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors"
              />
              {/* Botão de alternar visibilidade */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* --- MEDIDOR DE FORÇA DA SENHA --- */}
            <div className="mt-4 transition-all duration-300">
              {/* Barras de progresso segmentadas */}
              <div className="flex gap-2 h-1.5 mb-2">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      strengthScore >= level ? getStrengthColor() : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              
              {/* Texto de Status */}
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold transition-colors duration-300 ${
                    strengthScore === 4 ? 'text-green-400' : 
                    strengthScore >= 2 ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {getStrengthText()}
                </span>
                <span className="text-white/40">{formData.password.length}/8 chars</span>
              </div>

              {/* Lista de Requisitos (Feedback visual extra) */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] sm:text-xs text-white/60">
                 <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-400' : ''}`}>
                    {formData.password.length >= 8 ? <Check size={12}/> : <div className="w-3 h-3 rounded-full border border-white/30"/>}
                    <span>Min. 8 caracteres</span>
                 </div>
                 <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    {/[0-9]/.test(formData.password) ? <Check size={12}/> : <div className="w-3 h-3 rounded-full border border-white/30"/>}
                    <span>Número</span>
                 </div>
                 <div className={`flex items-center gap-1 ${/[!@#$%^&*]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    {/[!@#$%^&*]/.test(formData.password) ? <Check size={12}/> : <div className="w-3 h-3 rounded-full border border-white/30"/>}
                    <span>Símbolo Especial</span>
                 </div>
                 <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? <Check size={12}/> : <div className="w-3 h-3 rounded-full border border-white/30"/>}
                    <span>Maiúscula e Minúscula</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Botão de Registro */}
          <button 
            type="submit"
            disabled={strengthScore < 3} // Opcional: Bloquear se a senha for fraca
            className={`
              w-full py-3.5 mt-6 font-bold text-lg rounded-full shadow-lg transition-all duration-300
              ${strengthScore < 3 
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
                : 'bg-white text-gray-900 hover:bg-gray-100 hover:scale-[1.02]'
              }
            `}
          >
            Criar Conta
          </button>
        </form>

        {/* Rodapé */}
        <div className="text-center mt-8 text-sm">
          <span className="opacity-80">Já possui acesso? </span>
          <Link href="/login" className="font-bold hover:underline ml-1 hover:text-neon-cyan transition-colors">
            Faça Login
          </Link>
        </div>

      </div>
    </main>
  );
}