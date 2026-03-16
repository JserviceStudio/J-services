import { InventoryItem, Transaction, Activity } from '@jservices/contracts';
import { clientInventoryMock, clientTransactionsMock, clientActivityMock } from '@/mocks/client.mock';
import { ClientWorkspaceRepository } from './client-workspace.repository';

export const mockClientWorkspaceRepository: ClientWorkspaceRepository = {
  async getInventory(): Promise<InventoryItem[]> {
    return clientInventoryMock;
  },
  async getTransactions(): Promise<Transaction[]> {
    return clientTransactionsMock;
  },
  async getActivity(): Promise<Activity[]> {
    return clientActivityMock;
  }
};
