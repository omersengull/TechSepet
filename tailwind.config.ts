import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif']
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      width: {
        '120': '30rem',
        '200': '53rem'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        renk1: '#df0000',
        renk2:'#f5f5f5'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
export default config;
