import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  title: z.string(),
  price: z.number(),
  image: z.string(),
  affiliateUrl: z.string().url(),
  isStarterProduct: z.boolean().optional().default(false),
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/lists' }),
  schema: z.object({
    title: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
    products: z.array(productSchema),
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
