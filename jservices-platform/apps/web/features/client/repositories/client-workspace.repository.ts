import { InventoryItem, Transaction, Activity } from '@jservices/contracts';

export interface ClientWorkspaceRepository {
  getInventory(): Promise<InventoryItem[]>;
  getTransactions(): Promise<Transaction[]>;
  getActivity(): Promise<Activity[]>;
}
