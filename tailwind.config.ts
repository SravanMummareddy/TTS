import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        surface3: 'var(--surface3)',
        t1: 'var(--t1)',
        t2: 'var(--t2)',
        t3: 'var(--t3)',
        accent: 'var(--purple)',
        green: 'var(--green)',
        teal: 'var(--teal)',
        orange: 'var(--orange)',
        pink: 'var(--pink)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      borderRadius: {
        DEFAULT: 'var(--r)',
        sm: 'var(--rs)',
      },
      fontFamily: {
        sans: ['var(--font)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
