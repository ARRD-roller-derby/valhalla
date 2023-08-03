/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    {
      pattern: /^bg-\[#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\]$/,
    },
  ],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './pages_related/**/*.page.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Inter', 'sans-serif'],
      mono: ['Inter', 'sans-serif'],
      amatic: ['"amaticsc"', 'cursive'],
      poppins: ['"poppins"', 'sans-serif'],
    },

    extend: {
      animationDelay: {
        1: '0.1s',
        2: '0.2s',
        3: '0.3s',
        4: '0.4s',
        5: '0.5s',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        arrd: {
          // Couleurs principales
          primary: '#378f6a',
          secondary: '#0d4863',
          accent: '#1e583d',
          highlight: '#f4cb71',

          // Couleurs de texte
          text: '#adadad',
          textLight: '#dfdfdf',
          textExtraLight: '#f7f7f7',
          textDark: '#6e6e6e',

          textError: '#c15151',

          // Couleurs d'arrière-plan
          bg: '#18191a',
          bgDark: '#0d0d0e',
          bgLight: '#212422',
          bgLightExtra: 'rgb(56, 61, 58)',
          bgLightSubtitle: 'rgb(64, 70, 66)',

          // Couleurs d'accentuation
          link: '#30b980',

          // Couleurs de bordure
          border: '#2a2b2d',

          // Couleurs spécifiques
          discord: '#5468ff',
          discordHover: '#656c85cc',
        },
      },

      gridTemplateAreas: {
        'menu-desktop': ['nav nav', 'menu main'],
        'menu-mobile': ['nav', 'main', 'menu'],
      },
      gridTemplateColumns: {
        'menu-desktop': 'auto 1fr',
        'menu-mobile': '1fr',
      },
      gridTemplateRows: {
        'menu-desktop': 'auto 1fr',
        'menu-mobile': 'auto 1fr auto',
      },
    },
  },
  plugins: [require('@savvywombat/tailwindcss-grid-areas')],
}
