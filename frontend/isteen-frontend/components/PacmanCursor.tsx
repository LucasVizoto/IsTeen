'use client';

import { useEffect, useRef } from 'react';

export default function PacmanCursor() {
  const pacmanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pacman = pacmanRef.current;
    if (!pacman) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let pacmanX = mouseX;
    let pacmanY = mouseY;
    const speed = 0.08;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      const distX = mouseX - pacmanX;
      const distY = mouseY - pacmanY;

      // Otimização: se estiver muito perto, não recalcula
      if (Math.abs(distX) > 0.5 || Math.abs(distY) > 0.5) {
        pacmanX += distX * speed;
        pacmanY += distY * speed;

        const angle = Math.atan2(distY, distX) * 180 / Math.PI;

        pacman.style.left = `${pacmanX}px`;
        pacman.style.top = `${pacmanY}px`;
        pacman.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    // Limpeza ao desmontar o componente
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={pacmanRef}
      id="pacman" 
      className="fixed w-[60px] h-[60px] pointer-events-none z-0 drop-shadow-[0_0_8px_#FFFF00] will-change-transform"
      style={{ left: '50%', top: '50%' }} // Posição inicial segura
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <path className="pacman-mouth-top" d="M50 50 L95 50 A45 45 0 1 0 5 50 Z" fill="#FFFF00" />
        <path className="pacman-mouth-bottom" d="M50 50 L95 50 A45 45 0 1 1 5 50 Z" fill="#FFFF00" />
      </svg>
    </div>
  );
}