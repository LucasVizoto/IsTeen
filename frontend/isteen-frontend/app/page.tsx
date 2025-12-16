import PacmanCursor from '@/components/PacmanCursor';
import NeonButton from '@/components/NeonButton';
import ConsoleStatus from '@/components/ConsoleStatus';

export default function Home() {
  return (
    // A classe 'retrowave-background' foi movida para o 'body' no globals.css
    <main className="min-h-screen flex items-center justify-center p-4 font-mono relative overflow-hidden">
      
      {/* O Pacman (Cursor) */}
      <PacmanCursor />

      {/* Cartão Principal Transparente */}
      <div className=" 
        bg-[#121726]/70
        relative z-10 w-full max-w-[550px] 
        p-10 rounded-3xl 
        border-2 border-neon-purple 
        neon-border-purple 
        backdrop-blur-[2px]
      ">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center justify-center text-center mb-12 mt-2">
          <img className='size-10/12 mb-5' src={'/logo.png'}/>
          <p className="text-xl text-neon-cyan neon-text-glow-cyan font-bold tracking-[0.1em]">
            // O futuro é agora. Conecte-se.
          </p>
        </div>

        {/* Console de Status */}
        <ConsoleStatus />

        {/* Botões */}
        <div className="flex flex-col space-y-6 mb-10">
          <NeonButton>Acessar Conta</NeonButton>
          <NeonButton>Novo Registro</NeonButton>
        </div>

        {/* Rodapé */}
        <footer className="text-center text-sm text-gray-400 font-medium tracking-widest uppercase">
          <span className="mx-3">| Ajuda / Suporte |</span>
          <span className="mx-3">| Sobre IsTeen OS |</span>
        </footer>

      </div>
    </main>
  );
}