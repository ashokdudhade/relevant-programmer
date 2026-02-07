import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.relevantprogrammer.com',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },
});
