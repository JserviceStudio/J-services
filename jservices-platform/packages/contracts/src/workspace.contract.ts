import { z } from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string(),
  key: z.enum(['PUBLIC', 'CLIENT', 'RESELLER', 'ADMIN']),
  label: z.string(),
  description: z.string().optional(),
  route: z.string(),
  enabled: z.boolean().default(true),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
