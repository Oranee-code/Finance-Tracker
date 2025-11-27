/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        luxury: {
          cream: '#fdfbf7',
          beige: '#f5f0e8',
          navy: '#1e3a5f',
          'navy-light': '#2d4a6f',
          teal: '#0d9488',
          'teal-light': '#14b8a6',
          sky: '#7dd3fc',
          'sky-light': '#bae6fd',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'grow-bar': 'grow-bar 1.2s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'grow-bar': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom', opacity: '0' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
