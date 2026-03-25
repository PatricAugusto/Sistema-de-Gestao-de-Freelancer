/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)', 
        'brutal-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      colors: {
        'brutal-yellow': '#F4E04D',
        'brutal-blue': '#5E60CE',
      }
    },
  },
  plugins: [],
}