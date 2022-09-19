import {defineConfig} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import codeTheme from './src/utils/code-theme'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],

  markdown: {
    shikiConfig: {
      theme: codeTheme,
    },
  },
})
