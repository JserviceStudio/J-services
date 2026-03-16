import { z } from 'zod';

export const InventoryItemSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  productId: z.string(),
  profile: z.string(),
  code: z.string(),
  price: z.number(),
  status: z.enum(['AVAILABLE', 'USED', 'LOCKED', 'EXPIRED']),
  siteId: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
