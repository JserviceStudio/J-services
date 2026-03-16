import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  type: z.enum(['PURCHASE', 'RENEWAL', 'PAYOUT', 'REFUND']),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED']),
  reference: z.string(),
  amount: z.number(),
  currency: z.string().default('XOF'),
  productId: z.string().optional(),
  planId: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
