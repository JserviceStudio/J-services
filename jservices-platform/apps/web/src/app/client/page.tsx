import { AppShell, Sidebar } from '@jservices/ui';

export default function ClientDashboard() {
  const navItems = [
    { label: 'Dashboard', href: '/client' },
    { label: 'My Products', href: '/client/products' },
    { label: 'Licenses', href: '/client/licenses' },
    { label: 'Usage', href: '/client/usage' },
    { label: 'Settings', href: '/client/settings' },
  ];

  return (
    <AppShell sidebar={<Sidebar workspace="CLIENT" items={navItems} />}>
      <div className="p-10">
        <h1 className="text-2xl font-semibold text-slate-900">Client Operations</h1>
        <p className="text-slate-500 mt-2">Bienvenue dans votre espace d'exploitation.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-medium text-slate-500">Produits Actifs</h3>
            <p className="text-3xl font-bold mt-2">2</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-medium text-slate-500">Usage Data</h3>
            <p className="text-3xl font-bold mt-2">85%</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-medium text-slate-500">Sync Status</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-600">Stable</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
