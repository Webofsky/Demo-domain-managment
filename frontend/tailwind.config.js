/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
        colors: {
          theme: '#0f172a',
          primary: '#ddd6fe',
          secondary: '#020617'
        }
    },
  },
  plugins: [],
}