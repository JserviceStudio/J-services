import { z } from 'zod';

export const ActivitySchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  workspace: z.enum(['PUBLIC', 'CLIENT', 'RESELLER', 'ADMIN']),
  eventType: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string().optional(),
  reference: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type Activity = z.infer<typeof ActivitySchema>;
