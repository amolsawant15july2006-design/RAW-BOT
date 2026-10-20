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
        industrial: {
          950: '#05070A', // Deepest background
          900: '#0A0D12', // Body background
          850: '#11151C', // Section / panel background
          800: '#11161D', // Card background base
          750: '#151B23', // Card hover / border
          700: '#1B222C', // Card highlight / input bg
          600: '#2A3342', // Border dark
          500: '#3D4A5E', // Muted text
          400: '#7E8B9E', // Subtext
          300: '#BAC4D0', // Body text
          100: '#F0F4F8', // High-contrast text
        },
        status: {
          cyan: '#00E5FF',
          green: '#10B981',
          online: '#00FF66',
          yellow: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 229, 255, 0.35)',
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glow-orange': '0 0 20px -3px rgba(249, 115, 22, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'industrial-card': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
