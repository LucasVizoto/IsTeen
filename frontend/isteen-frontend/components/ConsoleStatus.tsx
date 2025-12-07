import React from 'react';

export default function ConsoleStatus() {
  return (
    <div className="
      w-full mb-8 p-6 rounded-xl 
      bg-transparent /* Fundo Transparente */
      border-2 border-neon-cyan
      neon-border-cyan /* Aplica o brilho intenso ciano */
    ">
      <div className="text-neon-cyan  font-mono text-sm leading-loose space-y-2 font-semibold tracking-wider">
        <p>
          <span className="text-neon-pink neon-text-glow-pink">[STATUS]:</span> Protocolo de inicialização IsTeen v3.2 iniciado.
        </p>
        <p>
          <span className="text-neon-pink neon-text-glow-pink">[VERIFY]:</span> Acesso à rede de jovens. Conexão estável.
        </p>
        <p>
          <span className="text-neon-pink neon-text-glow-pink">[PROMPT]:</span> Selecione a opção para continuar a sua jornada digital.
        </p>
      </div>
    </div>
  );
}