import { Product } from '@jservices/contracts';

export const catalogMock: Product[] = [
  {
    id: 'prod-wifi',
    code: 'wifi-core',
    slug: 'wifi-ticketing',
    name: 'WiFi Ticketing Core',
    shortDescription: 'Gestion complète de ticketing WiFi pour opérateurs.',
    category: 'CORE',
    status: 'ACTIVE',
    icon: 'Wifi',
    defaultRoute: '/client/products/wifi-ticketing',
  },
  {
    id: 'prod-saas',
    code: 'license-saas',
    slug: 'license-management',
    name: 'License SaaS Dashboard',
    shortDescription: 'Plateforme de gestion de licences et abonnements.',
    category: 'SAAS',
    status: 'ACTIVE',
    icon: 'Key',
    defaultRoute: '/client/products/license-management',
  }
];
