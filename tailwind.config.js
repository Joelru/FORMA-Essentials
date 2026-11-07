/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FAF7F5',
        pastelPink: '#FDF2F4',
        blush: '#F4C2C2',
        blushDeep: '#E8A598',
        roseGold: '#B76E79',
        roseGoldDark: '#9A5660',
        charcoal: '#2D2926',
        sage: '#6B9080',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(183, 110, 121, 0.14)',
        'soft': '0 4px 20px -2px rgba(45, 41, 38, 0.05)',
      }
    },
  },
  plugins: [],
}
