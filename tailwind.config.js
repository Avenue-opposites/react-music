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

