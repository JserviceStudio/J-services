import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  longDescription: z.string().optional(),
  category: z.string(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  icon: z.string().optional(),
  defaultRoute: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
