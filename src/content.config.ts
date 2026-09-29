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

const listSchema = z.object({
  title: z.string(),
  tabLabel: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
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
});

const photoSchema = z.object({
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
});

// Une vitrine = un storefront complet et autonome (nom, réseaux, textes,
// listes d'idées, Shoppable Photos). Nombre illimité, géré depuis l'admin
// ("+Nouveau" / supprimer une entrée) comme n'importe quelle autre
// collection — plus besoin de toucher au code pour ajouter une vitrine.
const vitrines = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/vitrines' }),
  schema: z.object({
    order: z.number().default(0),
    name: z.string(),
    handle: z.string(),
    tagline: z.string(),
    metaDescription: z.string(),
    avatar: z.string(),
    ogImage: z.string().optional(),
    amazonTag: z.string(),
    showPrices: z.boolean().default(false),
    socials: z.array(z.object({ platform: z.string(), url: z.string() })).optional().default([]),
    uiText: z.object({
      legalBadge: z.string(),
      legalDisclosure: z.string(),
      ideaListsHeading: z.string(),
      shoppablePhotosHeading: z.string(),
      shoppablePhotosSubtitle: z.string(),
      affiliateLinkLabel: z.string(),
      priceHiddenCta: z.string(),
      starterBadgeLabel: z.string(),
      shoppableCta: z.string(),
      footerGuideLinkText: z.string(),
    }),
    lists: z.array(listSchema).optional().default([]),
    photos: z.array(photoSchema).optional().default([]),
  }),
});

export const collections = { vitrines };
