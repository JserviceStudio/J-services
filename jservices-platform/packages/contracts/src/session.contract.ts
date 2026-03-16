import { z } from 'zod';
import { UserSchema } from './user.contract';
import { OrganizationSchema } from './organization.contract';
import { WorkspaceSchema } from './workspace.contract';

export const SessionSchema = z.object({
  user: UserSchema,
  activeOrganization: OrganizationSchema,
  memberships: z.array(z.object({
    organizationId: z.string(),
    role: z.string(),
    workspaceAccess: z.array(z.string()),
  })),
  availableWorkspaces: z.array(WorkspaceSchema),
  defaultWorkspace: WorkspaceSchema,
  requiresOnboarding: z.boolean().default(false),
});

export type Session = z.infer<typeof SessionSchema>;
