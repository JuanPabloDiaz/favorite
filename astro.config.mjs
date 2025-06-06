import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fav.jpdiaz.dev',
  output: 'server', // Puedes cambiar a "static" si no usas SSR
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    define: {
      'process.env.TMDB_API_KEY': JSON.stringify(process.env.TMDB_API_KEY),
      'process.env.LISTEN_NOTES_API_KEY': JSON.stringify(process.env.LISTEN_NOTES_API_KEY),
    },
    resolve: {
      alias: {
        '@services': '/src/services',
        '@data': '/src/data',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
      },
    },
  },
});
