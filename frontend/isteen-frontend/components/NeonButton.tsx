import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NeonButton({ children, onClick }: NeonButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="
        w-full block
        text
        text-neon-pink font-mono uppercase font-bold tracking-[0.2em]
        text-lg py-4 px-6 rounded-xl
        bg-transparent 
        border-2 border-neon-pink
        neon-border-pink
        transition-all duration-300
        hover:scale-[1.02]
        hover:border-neon-cyan
        neon-border-cyan
        hover:text-neon-cyan
      "
    >
      <span className="mr-4 text-base">&lt;</span> 
      <span className="neon-text-pink">{children}</span>
      <span className="ml-4 text-base">&gt;</span>
    </button>
  );
}