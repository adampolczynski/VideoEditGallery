/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#111111',
        'darker': '#050505',
        'accent': '#8CFF5F',
        'accent-purple': '#E5E7EB',
        'accent-pink': '#ff3b5c',
        'danger': '#E5484D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(0deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)' },
          '50%': { textShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 30px rgba(157, 78, 221, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.8)' },
        },
      },
      boxShadow: {
        'neon': '0 0 0 1px rgba(255,255,255,0.12), 0 18px 60px rgba(0,0,0,0.45)',
        'neon-lg': '0 0 0 1px rgba(255,255,255,0.16), 0 24px 80px rgba(0,0,0,0.55)',
        'soft': '0 18px 60px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
