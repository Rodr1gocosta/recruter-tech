/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f2',
          100: '#cce1e6',
          200: '#99c3cc',
          300: '#66a5b3',
          400: '#338799',
          500: '#006980',
          600: '#004254',
          700: '#00323f',
          800: '#00212a',
          900: '#001115',
        },
        wine: {
          50: '#f7e8ed',
          100: '#efd1db',
          200: '#dfa3b7',
          300: '#cf7593',
          400: '#bf476f',
          500: '#8f2a4f',
          600: '#480e2a',
          700: '#360b20',
          800: '#240715',
          900: '#12040b',
        }
      }
    },
  },
  plugins: [],
}
