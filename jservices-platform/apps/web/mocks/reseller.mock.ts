import { Commission, Payout } from '@jservices/contracts';

export const resellerCommissionsMock: Commission[] = [
  {
    id: 'comm-1',
    resellerOrgId: 'org-reseller-1',
    transactionId: 'tx-100',
    reference: 'COMM-TX-100',
    amount: 1500,
    status: 'PENDING',
    commissionDate: new Date().toISOString(),
    saleKind: 'WIFI_TICKET',
  }
];

export const resellerPayoutsMock: Payout[] = [
  {
    id: 'pay-1',
    resellerOrgId: 'org-reseller-1',
    amount: 50000,
    status: 'COMPLETED',
    operator: 'MTN',
    phoneNumber: '+22900000000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
