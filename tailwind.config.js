/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages_related/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        arrd: '#378f6a',
        second: '#0d4863',
        tierce: '#f4cb71',
        quator: '#1e583d',
        txt: '#adadad',
        txtLight: '#dfdfdf',
        txtError: '#c15151',
        bg: '#18191a',
        bgDark: '#0d0d0e',
        bgLight: '#212422',
        bgLightExtra: 'rgb(56, 61, 58)',
        bgLightSubtitle: 'rgb(64, 70, 66)',
        bgAccent: '#cecbc1',
        link: '#30b980',
        border: '#2a2b2d',
        discord: '#5468ff',
        discordHover: '#656c85cc',
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
