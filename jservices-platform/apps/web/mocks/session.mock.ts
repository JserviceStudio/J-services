import { Session } from '@jservices/contracts';

export const sessionMock: Session = {
  user: {
    id: 'user-1',
    email: 'admin@jservices.com',
    fullName: 'Platform Admin',
    status: 'ACTIVE',
    globalRoles: ['platform_admin', 'org_admin'],
  },
  activeOrganization: {
    id: 'org-1',
    name: 'J+SERVICES Global',
    slug: 'jservices-global',
    type: 'INTERNAL',
    status: 'ACTIVE',
    country: 'BJ',
    currency: 'XOF',
    createdAt: new Date().toISOString(),
  },
  memberships: [
    {
      organizationId: 'org-1',
      role: 'platform_admin',
      workspaceAccess: ['PUBLIC', 'CLIENT', 'RESELLER', 'ADMIN'],
    }
  ],
  availableWorkspaces: [
    { id: 'ws-1', key: 'PUBLIC', label: 'Public Site', route: '/', enabled: true },
    { id: 'ws-2', key: 'CLIENT', label: 'Client OPS', route: '/client', enabled: true },
    { id: 'ws-3', key: 'RESELLER', label: 'Partner Hub', route: '/reseller', enabled: true },
    { id: 'ws-4', key: 'ADMIN', label: 'Platform Admin', route: '/admin', enabled: true },
  ],
  defaultWorkspace: { id: 'ws-4', key: 'ADMIN', label: 'Platform Admin', route: '/admin', enabled: true },
  requiresOnboarding: false,
};
