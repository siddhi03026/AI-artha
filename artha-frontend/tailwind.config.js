/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accentStart: '#7C3AED',
        accentEnd: '#A78BFA',
        background: '#F3F5F9',
        card: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
      },
    },
  },
  plugins: [],
}

