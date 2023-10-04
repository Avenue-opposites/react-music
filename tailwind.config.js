import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'jump-once': 'jump .3s ease-in-out',
        'disk-spin': 'spin 40s linear infinite',
        shake: 'shake 0.3s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '33%': {
            transform: 'translateX(2%)',
          },
          '66%': {
            transform: 'translateX(-2%)',
          },
        },
        jump: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        }
      }
    },
  },
  plugins: [
    forms({
      strategy: 'class',
    })
  ],
}

