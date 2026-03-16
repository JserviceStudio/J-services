import type { ShellContext } from '@/components/ui/app-shell';

export const adminShellContext: ShellContext = {
  area: 'Platform control plane',
  title: 'Admin',
  description: 'Gouvernance plateforme, catalogue produit, comptes et supervision.',
  navItems: [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', section: 'Control' },
    { href: '/admin/accounts', label: 'Accounts', icon: 'accounts', section: 'Operations' },
    { href: '/admin/products', label: 'Products', icon: 'products', section: 'Operations' },
    { href: '/admin/licenses', label: 'Licenses', icon: 'licenses', section: 'Operations' },
    { href: '/admin/resellers', label: 'Resellers', icon: 'resellers', section: 'Operations' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings', section: 'System' },
  ],
};

export const clientShellContext: ShellContext = {
  area: 'Client workspace',
  title: 'Client',
  description: 'Produits actifs, operations terrain, licences et synchronisation.',
  navItems: [
    { href: '/client', label: 'Dashboard', icon: 'dashboard', section: 'Workspace' },
    { href: '/client/products', label: 'Active Products', icon: 'products', section: 'Workspace' },
    { href: '/client/tiketmomo', label: 'TiketMomo', icon: 'app', section: 'Apps' },
    { href: '/client/settings', label: 'Settings', icon: 'settings', section: 'Admin' },
  ],
};

export const resellerShellContext: ShellContext = {
  area: 'Reseller workspace',
  title: 'Reseller',
  description: 'Catalogue vendable, commissions, retraits et operations commerciales.',
  navItems: [
    { href: '/reseller', label: 'Dashboard', icon: 'dashboard', section: 'Workspace' },
    { href: '/reseller/catalog', label: 'Catalog', icon: 'products', section: 'Commerce' },
    { href: '/reseller/payouts', label: 'Payouts', icon: 'payouts', section: 'Commerce' },
    { href: '/reseller/settings', label: 'Settings', icon: 'settings', section: 'Admin' },
  ],
};
