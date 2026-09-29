import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  title: z.string(),
  badge: z.string().optional(),
  price: z.number(),
  // Prix de référence réel (avant réduction) — optionnel, affiché barré avec le
  // % d'économie s'il est renseigné. Voir guide de déploiement pour la règle
  // française du prix de référence (doit refléter le prix réellement pratiqué
  // dans les 30 derniers jours, à tenir à jour).
  originalPrice: z.number().nullable().optional(),
  image: z.string(),
  affiliateUrl: z.string().url(),
  isStarterProduct: z.boolean().optional().default(false),
});

// Fabriques réutilisées par les deux vitrines (site 1 : lists/photos,
// site 2 : lists2/photos2) pour que leurs schémas restent identiques et
// ne divergent jamais accidentellement.
const makeListsCollection = (base: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.yaml', base }),
    schema: z.object({
      title: z.string(),
      tabLabel: z.string().optional(),
      icon: z.string().optional(),
      description: z.string().optional(),
      order: z.number().default(0),
      // Cas simple : produits directement dans la liste.
      products: z.array(productSchema).optional().default([]),
      // Cas avancé : produits groupés par sous-idée (ex. "Leurres souples",
      // "Leurres durs"...). Si renseigné, prend le pas sur `products` ci-dessus.
      subIdeas: z
        .array(
          z.object({
            title: z.string(),
            products: z.array(productSchema),
          })
        )
        .optional()
        .default([]),
    }),
  });

const makePhotosCollection = (base: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.yaml', base }),
    schema: z.object({
      title: z.string(),
      order: z.number().default(0),
      image: z.string(),
      imageWidth: z.number(),
      imageHeight: z.number(),
      hotspots: z.array(
        z.object({
          x: z.number().min(0).max(100),
          y: z.number().min(0).max(100),
          title: z.string(),
          price: z.number(),
          affiliateUrl: z.string().url(),
        })
      ),
    }),
  });

const lists = makeListsCollection('./src/content/lists');
const photos = makePhotosCollection('./src/content/photos');

// Vitrine 2 : deuxième storefront indépendant, géré séparément dans l'admin
// (contenu propre, même structure).
const lists2 = makeListsCollection('./src/content/lists2');
const photos2 = makePhotosCollection('./src/content/photos2');

export const collections = { lists, photos, lists2, photos2 };
