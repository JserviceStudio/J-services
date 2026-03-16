import { Commission, Payout } from '@jservices/contracts';
import { resellerCommissionsMock, resellerPayoutsMock } from '@/mocks/reseller.mock';
import { ResellerWorkspaceRepository } from './reseller-workspace.repository';

export const mockResellerWorkspaceRepository: ResellerWorkspaceRepository = {
  async getCommissions(): Promise<Commission[]> {
    return resellerCommissionsMock;
  },
  async getPayouts(): Promise<Payout[]> {
    return resellerPayoutsMock;
  }
};
