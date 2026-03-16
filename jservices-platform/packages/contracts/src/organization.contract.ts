import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['ENTERPRISE', 'PARTNER', 'INTERNAL', 'OPERATOR']),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED']),
  logoUrl: z.string().optional(),
  country: z.string().default('BJ'),
  currency: z.string().default('XOF'),
  createdAt: z.string().datetime(),
});

export type Organization = z.infer<typeof OrganizationSchema>;
