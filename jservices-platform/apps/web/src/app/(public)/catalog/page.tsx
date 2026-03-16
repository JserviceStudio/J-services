import { AppShell, Sidebar } from '@jservices/ui';

export default function CatalogPage() {
  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Produits', href: '/products' },
    { label: 'Tarifs', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <AppShell sidebar={<Sidebar workspace="PUBLIC" items={navItems} />}>
      <div className="p-10">
        <h1 className="text-3xl font-bold text-slate-900">Catalogue de Services</h1>
        <p className="text-slate-600 mt-2">Découvrez nos solutions intelligentes pour votre entreprise.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
             <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                [Image Produit]
             </div>
             <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">WiFi Ticketing Core</h3>
                <p className="text-sm text-slate-500 mt-2">Gestion automatisée des accès hotspot.</p>
                <a href="/products/wifi-ticketing" className="mt-4 inline-block text-blue-600 font-medium text-sm">En savoir plus →</a>
             </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
