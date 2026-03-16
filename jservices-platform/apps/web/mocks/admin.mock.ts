import { Organization, User, SyncJob, Notification } from '@jservices/contracts';

export const adminOrganizationsMock: Organization[] = [
  {
    id: 'org-1',
    name: 'J+SERVICES Global',
    slug: 'jservices-global',
    type: 'INTERNAL',
    status: 'ACTIVE',
    country: 'BJ',
    currency: 'XOF',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'org-2',
    name: 'Entreprise Client A',
    slug: 'client-a',
    type: 'ENTERPRISE',
    status: 'ACTIVE',
    country: 'BJ',
    currency: 'XOF',
    createdAt: new Date().toISOString(),
  }
];

export const adminUsersMock: User[] = [
  {
    id: 'user-1',
    email: 'admin@jservices.com',
    fullName: 'Platform Admin',
    status: 'ACTIVE',
    globalRoles: ['platform_admin'],
  }
];

export const adminSyncJobsMock: SyncJob[] = [
  {
    id: 'sync-1',
    organizationId: 'org-1',
    source: 'MOBILE_APP',
    jobType: 'VOUCHER_SYNC',
    status: 'COMPLETED',
    batchSize: 100,
    inserted: 95,
    ignored: 5,
    createdAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  }
];
