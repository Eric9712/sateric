// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Remplacez par votre domaine définitif avant le déploiement (voir guide de déploiement).
  site: 'https://votre-domaine.fr',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});