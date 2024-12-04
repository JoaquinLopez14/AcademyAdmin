/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        Bebas: ["Bebas Neue", "serif"],
        Montserrat: ["Montserrat", "serif"],
        Raleway: ["Raleway", "serif"],
        Staatliches: ["Staatliches", "serif"],
      },
    },
  },
  plugins: [],
};
