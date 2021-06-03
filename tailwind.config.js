const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: [
      './index.html',
      './src/**/*.jsx',
      './src/**/*.js',
    ],
  },
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'gold': '#F2D39D',
        'gold-darker': '#EFC581',
        'blackish': '#0D0D0D',
      },
    },
  },
  variants: {}
};
