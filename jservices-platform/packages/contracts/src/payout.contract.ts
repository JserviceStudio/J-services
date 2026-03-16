import { z } from 'zod';

export const PayoutSchema = z.object({
  id: z.string(),
  resellerOrgId: z.string(),
  amount: z.number(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED']),
  operator: z.string(),
  phoneNumber: z.string(),
  errorMessage: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Payout = z.infer<typeof PayoutSchema>;
