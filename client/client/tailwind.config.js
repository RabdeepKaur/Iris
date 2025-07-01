/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./index.html",
    ],
    theme: {
      extend: {
         colors: {
           border: 'hsl(var(--border))', 
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // You can also add other variables like card, primary, etc.
      },
      },
    },
    plugins: [],
  }