/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          default: '#0d1117',
          subtle: '#161b22',
          inset: '#010409',
          overlay: '#1c2128',
        },
        border: {
          default: '#30363d',
          subtle: '#21262d',
        },
        accent: {
          blue: '#58a6ff',
          green: '#3fb950',
          yellow: '#d29922',
          purple: '#bc8cff',
        }
      }
    },
  },
  plugins: [],
}