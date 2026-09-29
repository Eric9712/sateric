// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Domaine canonique choisi : sans "www" (même si www.sateric.com est aussi
  // actif). Comme les balises canoniques de chaque page sont construites à
  // partir de cette valeur (et non du nom d'hôte réellement utilisé par le
  // visiteur), les deux adresses restent utilisables sans créer de contenu
  // dupliqué aux yeux de Google : toutes les pages déclarent sateric.com
  // comme référence, qu'on y accède via www ou non.
  site: 'https://sateric.com',

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

  integrations: [
    // Exclut /aller/* : ce sont des pages de redirection (noindex), pas du
    // contenu à faire indexer — les lister dans le sitemap contredirait leur
    // propre balise noindex et gaspillerait le budget de crawl de Google.
    sitemap({ filter: (page) => !page.includes('/aller/') }),
  ]
});