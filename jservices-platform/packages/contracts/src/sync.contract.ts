import { z } from 'zod';

export const SyncJobSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  source: z.string(),
  jobType: z.string(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  batchSize: z.number().default(0),
  inserted: z.number().default(0),
  ignored: z.number().default(0),
  errorMessage: z.string().optional(),
  createdAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
});

export type SyncJob = z.infer<typeof SyncJobSchema>;
