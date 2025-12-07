import type { Config } from "tailwindcss";

const config: Config = {
  // AQUI ESTAVA O ERRO: Removemos o "src/" dos caminhos
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Se você tiver uma pasta pages na raiz, mantenha, senão pode remover
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        isteen: {
          bg: "#0a0a12",
          panel: "#121726",
          neon: {
            pink: "#ec4899",
            cyan: "#22d3ee",
            purple: "#a855f7",
          }
        }
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.6)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'neon-cyan': '0 0 10px rgba(34, 211, 238, 0.2)',
        'neon-text': '0 0 10px rgba(255, 255, 255, 0.8)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;