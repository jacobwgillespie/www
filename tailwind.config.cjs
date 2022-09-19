/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
  plugins: [require('@tailwindcss/typography')],
}
