/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Important for the toggle
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', // Dynamic primary color
        secondary: '#FDCB6E', // The yellow accent
        dark: '#2D3436',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}