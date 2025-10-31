// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC700', // The yellow from the Figma design
        secondary: '#F3F4F6', // A light gray for backgrounds
      }
    },
  },
  plugins: [],
}