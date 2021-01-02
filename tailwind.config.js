module.exports = {
  purge: ['./pages/**/*.js', './src/components/**/*.js'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        mono: ['Hasklig', 'Source Code Pro', 'Courier New', 'Courier', 'monospace'],
        serif: ['Iowan Old Style', 'Sitka Text', 'Palatino', 'Book Antiqua', 'serif'],
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.black'),
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
