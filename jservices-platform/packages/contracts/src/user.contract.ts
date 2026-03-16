import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  avatarUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
  globalRoles: z.array(z.string()),
  lastLoginAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;
