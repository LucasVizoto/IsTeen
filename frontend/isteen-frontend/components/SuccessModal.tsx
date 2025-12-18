// src/components/SuccessModal.tsx
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export default function SuccessModal({ 
  isOpen, 
  title = "Sucesso!", 
  message = "Operação realizada com êxito." 
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay escuro de fundo */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* O Card do Modal */}
      <div className="
        relative z-10 
        flex flex-col items-center justify-center 
        bg-[#121726] 
        border-2 border-green-500 
        rounded-2xl 
        p-8 sm:p-10 
        text-center 
        max-w-sm w-full
        shadow-[0_0_30px_rgba(34,197,94,0.4)]
        animate-in zoom-in-95 duration-300
      ">
        {/* Ícone Animado */}
        <div className="mb-4 rounded-full bg-green-500/20 p-4 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
          <CheckCircle className="text-green-400 w-12 h-12 animate-bounce" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6">
          {message}
        </p>

        {/* Spinner de redirecionamento */}
        <div className="flex items-center gap-2 text-xs text-green-400/80 font-mono uppercase tracking-widest">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          Redirecionando...
        </div>
      </div>
    </div>
  );
}