/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0a0f1e',
          secondary: '#0d1426',
          card: '#111827',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#22c55e',
          red: '#ef4444',
          purple: '#8b5cf6',
          amber: '#f59e0b',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
