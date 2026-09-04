/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          beige: '#F4F0DD',
          indigo: '#A88AED',
          celery: '#A6C261',
          indigoDark: '#8B6BD6',
          celeryDark: '#8AA648',
          bgSoft: '#FAF9F5',
          textDark: '#333138'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
