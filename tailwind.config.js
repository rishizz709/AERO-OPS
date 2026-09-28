/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aviation: {
          darkest: '#070D1F',
          dark: '#0B132B',
          navy: '#1C2541',
          surface: '#1E293B',
          border: '#334155',
          blue: '#1E40AF',
          primary: '#2563EB',
          accent: '#06B6D4',
          cyan: '#00F0FF',
          sky: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          delayed: '#F97316',
          critical: '#EF4444',
          intel: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Manrope', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
