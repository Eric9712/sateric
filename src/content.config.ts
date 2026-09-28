import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  title: z.string(),
  price: z.number(),
  // Prix de référence réel (avant réduction) — optionnel, affiché barré avec le
  // % d'économie s'il est renseigné. Voir guide de déploiement pour la règle
  // française du prix de référence (doit refléter le prix réellement pratiqué
  // dans les 30 derniers jours, à tenir à jour).
  originalPrice: z.number().optional(),
  image: z.string(),
  affiliateUrl: z.string().url(),
  isStarterProduct: z.boolean().optional().default(false),
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/lists' }),
  schema: z.object({
    title: z.string(),
    tabLabel: z.string().optional(),
    icon: z.string().optional(),
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

const photos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/photos' }),
  schema: z.object({
    title: z.string(),
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

export const collections = { lists, photos };
