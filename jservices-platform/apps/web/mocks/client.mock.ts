import { InventoryItem, Transaction, Activity } from '@jservices/contracts';

export const clientInventoryMock: InventoryItem[] = [
  {
    id: 'inv-1',
    organizationId: 'org-1',
    productId: 'prod-wifi',
    profile: 'Gold',
    code: 'WIFI-CODE-1234',
    price: 500,
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  }
];

export const clientTransactionsMock: Transaction[] = [
  {
    id: 'tx-1',
    organizationId: 'org-1',
    type: 'PURCHASE',
    status: 'SUCCESS',
    reference: 'TX-REF-001',
    amount: 5000,
    currency: 'XOF',
    productId: 'prod-wifi',
    createdAt: new Date().toISOString(),
  }
];

export const clientActivityMock: Activity[] = [
  {
    id: 'act-1',
    organizationId: 'org-1',
    workspace: 'CLIENT',
    eventType: 'PRODUCT_ACTIVATION',
    title: 'WiFi Ticketing Activé',
    description: 'Le produit WiFi Ticketing Core a été activé avec succès.',
    createdAt: new Date().toISOString(),
  }
];
