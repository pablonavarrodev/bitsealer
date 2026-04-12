/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  // Usamos la clase .dark en <html> para el modo oscuro
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        btc: {
          400: '#ffcc00',
          500: '#f7931a',
          600: '#e67e00',
        },
      },
    },
  },

  plugins: [],
};
