/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
        },
      },
    },
  },
  plugins: [],
};