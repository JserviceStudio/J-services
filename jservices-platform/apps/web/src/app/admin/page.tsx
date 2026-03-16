import { AppShell, Sidebar } from '@jservices/ui';

export default function AdminDashboard() {
  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Organizations', href: '/admin/organizations' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Licenses', href: '/admin/licenses' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <AppShell sidebar={<Sidebar workspace="ADMIN" items={navItems} />}>
      <div className="p-10 min-h-screen text-slate-900">
        <h1 className="text-2xl font-bold">Platform Admin</h1>
        <p className="text-slate-500 mt-1">Global ecosystem overview.</p>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-medium">Organizations Health</h3>
            <div className="mt-4 space-y-4">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
