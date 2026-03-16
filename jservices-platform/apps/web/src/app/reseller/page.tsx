import { AppShell, Sidebar } from '@jservices/ui';

export default function ResellerDashboard() {
  const navItems = [
    { label: 'Overview', href: '/reseller' },
    { label: 'My Sales', href: '/reseller/sales' },
    { label: 'Commissions', href: '/reseller/commissions' },
    { label: 'Payouts', href: '/reseller/payouts' },
    { label: 'Settings', href: '/reseller/settings' },
  ];

  return (
    <AppShell sidebar={<Sidebar workspace="RESELLER" items={navItems} />}>
      <div className="p-10 min-h-screen">
        <h1 className="text-2xl font-semibold text-emerald-900">Partner Hub</h1>
        <p className="text-emerald-700/70 mt-2">Suivi de vos performances et commissions.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-emerald-100 rounded-xl shadow-sm">
            <h3 className="font-medium text-emerald-600/80 uppercase text-xs tracking-wider">Balance</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-950">150,000 F</p>
          </div>
          <div className="p-6 bg-white border border-emerald-100 rounded-xl shadow-sm">
            <h3 className="font-medium text-emerald-600/80 uppercase text-xs tracking-wider">Ventes (30j)</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-950">12</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
