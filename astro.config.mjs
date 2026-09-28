// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Remplacez par votre domaine définitif avant le déploiement (voir guide de déploiement).
  site: 'https://votre-domaine.fr',

  // Le serveur de dev Astro ne résout pas /admin (ni /admin/) vers
  // public/admin/index.html tout seul : redirection explicite pour le confort
  // en dev. En production, Cloudflare Pages sert nativement index.html pour
  // une requête de dossier, donc /admin/ fonctionne aussi sans cette entrée
  // (elle est d'ailleurs ignorée au build : avertissement inoffensif, le
  // fichier public/admin/index.html reste servi tel quel).
  redirects: {
    '/admin': '/admin/index.html',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});