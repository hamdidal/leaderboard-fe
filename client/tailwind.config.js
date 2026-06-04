/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config['theme']['fontFamily']} */
const appSans = ['"Manrope"', 'system-ui', 'sans-serif'];

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: appSans,
      serif: defaultTheme.fontFamily.serif,
      mono: defaultTheme.fontFamily.mono,
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        border: 'hsl(var(--border))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        podium: {
          gold: 'hsl(var(--podium-gold))',
          silver: 'hsl(var(--podium-silver))',
          bronze: 'hsl(var(--podium-bronze))',
        },
      },
    },
  },
  plugins: [],
};
