/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mrs: {
          yellow: '#FFD700',
          black: '#101010',
          red: '#E10600',
          gray: '#1F1F1F',
          light: '#F3F3F3'
        }
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'sans-serif'],
        display: ['"Racing Sans One"', 'cursive'],
      },
      backgroundImage: {
        'carbon': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
        'checkered': "url('https://www.transparenttextures.com/patterns/checkered-pattern.png')"
      }
    },
  },
  plugins: [],
}