/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'customXl': { 'raw': '((min-width: 1280px) and (max-height: 1000px))' },
      },
      animationDelay500: {
        'animation-delay': '500ms'
      },
      boxShadow: {
        'custom': '8px 8px 0 rgba(0, 0, 0, 0.2)',
        'button': '0 0 0 black',
        'button-hover': '0.4rem 0.4rem 0 black'
      },
      backgroundImage: {
        'player1': "url('../player1.png')",
        'player2': "url('../player2.png')",
      },
      keyframes: {
        zoomInOut: {
          '0%': { transform: 'scale(0, 0)' },
          '75%': { transform: 'scale(1.15, 1.15)' },
          '100': { transform: 'scale(1, 1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(35%)', opacity: 0 },
          '100': { transform: 'translateY(0%)', opacity: 1 },
        }
      },
      animation: {
        zoomInOut: 'zoomInOut 0.35s ease-in-out',
        slideUp: 'slideUp 0.5s linear'
      }
    },
  },
  plugins: [],
}
