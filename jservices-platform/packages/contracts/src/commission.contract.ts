import { z } from 'zod';

export const CommissionSchema = z.object({
  id: z.string(),
  resellerOrgId: z.string(),
  transactionId: z.string(),
  reference: z.string(),
  amount: z.number(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
  commissionDate: z.string().datetime(),
  saleKind: z.string(),
});

export type Commission = z.infer<typeof CommissionSchema>;
