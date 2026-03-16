import { Commission, Payout } from '@jservices/contracts';

export interface ResellerWorkspaceRepository {
  getCommissions(): Promise<Commission[]>;
  getPayouts(): Promise<Payout[]>;
}
