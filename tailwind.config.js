/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'fundo_retro': "url('/src/assets/background.png')"
      }
    },
  },
  plugins: [],
}

