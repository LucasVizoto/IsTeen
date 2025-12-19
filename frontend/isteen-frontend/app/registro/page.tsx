'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/api'; 
import { User, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
// 1. Importar o componente
import SuccessModal from '@/components/SuccessModal'; 

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 2. Estado para controlar o Modal de Sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LÓGICA DE SENHA (MANTIDA) ---
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setFormData({ ...formData, password: newPass });
    setStrengthScore(calculateStrength(newPass));
  };

  const getStrengthColor = () => {
    if (strengthScore === 0) return 'bg-white/20';
    if (strengthScore <= 2) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (strengthScore === 3) return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]';
    return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
  };

  const getStrengthText = () => {
    if (strengthScore === 0) return '';
    if (strengthScore <= 2) return 'Senha Fraca';
    if (strengthScore === 3) return 'Senha Média';
    return 'Senha Forte';
  };

  // --- LÓGICA DE ENVIO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await registerUser(formData);

      // 3. Em vez de redirecionar imediatamente, mostramos o modal
      setShowSuccessModal(true);

      // 4. Aguarda 2 ou 3 segundos mostrando o sucesso antes de ir para o login
      setTimeout(() => {
        router.push('/login');
      }, 2500);
      
    } catch (error: any) {
      console.error('Erro de rede:', error);
      const msg = error.response?.data?.message || 'Erro ao conectar com o servidor.';
      setErrorMessage(msg);
      setIsLoading(false); // Só paramos o loading se der erro. Se der sucesso, mantemos o modal.
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/retro-wave.png')" }}
    >
      {/* 5. Inserir o Componente do Modal aqui (ficará por cima de tudo) */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        title="Conta Criada!" 
        message="Seu acesso ao sistema foi garantido. Preparando ambiente..."
      />

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
        <p className="text-center text-white/60 mb-6 text-sm">
          Junte-se à rede IsTeen OS v3.2
        </p>

        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="
            mb-6 p-4 rounded-xl 
            bg-red-600/40 border-2 border-red-400 
            flex items-center gap-3 text-sm text-white font-semibold 
            shadow-[0_0_15px_rgba(248,113,113,0.4)] backdrop-blur-md
          ">
            <AlertCircle size={20} className="text-red-200 animate-pulse" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          
          {/* Nome */}
          <div className="relative">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest mb-1 ml-1 text-white/70">
              Nome de Usuário
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="name"
                required
                disabled={isLoading}
                placeholder="Ex: CyberTeen"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors disabled:opacity-50"
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
                required
                disabled={isLoading}
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors disabled:opacity-50"
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
                required
                disabled={isLoading}
                placeholder="Crie uma senha forte"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10 pl-1 placeholder-white/30 transition-colors disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Medidor de Força */}
            <div className="mt-4 transition-all duration-300">
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
              
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold transition-colors duration-300 ${
                    strengthScore === 4 ? 'text-green-400' : 
                    strengthScore >= 2 ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {getStrengthText()}
                </span>
                <span className="text-white/40">{formData.password.length}/8 chars</span>
              </div>

              {/* Checklists */}
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
            disabled={strengthScore < 3 || isLoading || showSuccessModal} // Trava também se o modal estiver aberto
            className={`
              w-full py-3.5 mt-6 font-bold text-lg rounded-full shadow-lg transition-all duration-300 flex items-center justify-center
              ${(strengthScore < 3 || isLoading || showSuccessModal)
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
                : 'bg-white text-gray-900 hover:bg-gray-100 hover:scale-[1.02]'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

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