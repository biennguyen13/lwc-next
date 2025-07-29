/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Custom colors for charts
        chart: {
          light: {
            bg: '#ffffff',
            text: '#333333',
            grid: '#f0f0f0',
            border: '#cccccc',
          },
          dark: {
            bg: '#1f2937',
            text: '#f9fafb',
            grid: '#374151',
            border: '#4b5563',
          },
        },
      },
    },
  },
  plugins: [],
} 