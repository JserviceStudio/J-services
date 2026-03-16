import { Organization, User, SyncJob } from '@jservices/contracts';
import { adminOrganizationsMock, adminUsersMock, adminSyncJobsMock } from '@/mocks/admin.mock';
import { AdminWorkspaceRepository } from './admin-workspace.repository';

export const mockAdminWorkspaceRepository: AdminWorkspaceRepository = {
  async getOrganizations(): Promise<Organization[]> {
    return adminOrganizationsMock;
  },
  async getUsers(): Promise<User[]> {
    return adminUsersMock;
  },
  async getSyncJobs(): Promise<SyncJob[]> {
    return adminSyncJobsMock;
  }
};
