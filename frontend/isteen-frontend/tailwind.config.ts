import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
theme: {
    extend: {
      // CORREÇÃO: Cores "flat" (sem aninhamento) para bater com suas classes
      colors: {
        'neon-purple': '#8A2BE2',
        'neon-pink': '#FF69B4',
        'neon-cyan': '#00FFFF',
        'dark-grid': '#151525', // Cor de fundo do HTML original
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Lucida Console', 'monospace'],
      },
      boxShadow: {
        'glow-pink': '0 0 10px rgba(255, 105, 180, 0.7)',
        'glow-cyan': '0 0 10px rgba(0, 255, 255, 0.7)',
        'glow-purple': '0 0 15px rgba(138, 43, 226, 0.7)',
      }
    },
  },
  plugins: [],
};
export default config;