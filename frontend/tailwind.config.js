/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          primary: '#636B2F',
          sage: '#BAC095',
          lime: '#D4DE95',
          deep: '#3D4127',
        },
        canvas: '#F7F8F1',
        surface: '#FFFFFF',
        textPrimary: '#3D4127',
        textMuted: '#6B7058',
        borderSubtle: '#E2E4D6',
        danger: '#A6493B',
        warning: '#C99A3C',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Public Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '24px',
      },
      boxShadow: {
        '3d-sm': '0 4px 0 #3D4127, 0 8px 16px rgba(61, 65, 39, 0.15)',
        '3d-md': '0 6px 0 #3D4127, 0 12px 24px rgba(61, 65, 39, 0.18)',
        '3d-card': '0 10px 30px -10px rgba(61, 65, 39, 0.2), 0 2px 8px rgba(61, 65, 39, 0.08)',
        '3d-hover': '0 20px 40px -10px rgba(61, 65, 39, 0.25), 0 4px 12px rgba(61, 65, 39, 0.12)',
      },
    },
  },
  plugins: [],
};
