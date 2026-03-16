import { Organization, User, SyncJob } from '@jservices/contracts';

export interface AdminWorkspaceRepository {
  getOrganizations(): Promise<Organization[]>;
  getUsers(): Promise<User[]>;
  getSyncJobs(): Promise<SyncJob[]>;
}
