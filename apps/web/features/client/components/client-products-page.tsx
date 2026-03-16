'use client';

import { ProductGrid } from '@/components/ui/product-grid';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useClientDashboard } from '@/features/client/hooks/use-client-dashboard';
import { Blocks, CreditCard, Route } from 'lucide-react';

export function ClientProductsPage() {
  const { data, error, loading } = useClientDashboard();
  const products = (data?.workspace?.active_products ?? []).map((product) => ({
    id: product.id,
    code: product.product_code,
    name: product.product_name,
    product_type: product.product_type,
    status: product.status,
    default_route: product.default_route,
    product_plan_name: product.product_plan_name,
    product_plan_code: product.product_plan_code,
  }));

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Client workspace"
        title="Active Products"
        description="Produits actuellement actives pour ce client dans l’ecosysteme J+SERVICES."
        badge="Subscription driven"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des produits actifs...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Products" value={String(data.workspace?.products_count ?? 0)} hint="Produits actifs dans cet espace client." tone="manager" icon={Blocks} />
            <StatCard label="Current route" value={data.workspace?.current_product?.default_route ?? '—'} hint="Point d’entree du produit courant." tone="public" icon={Route} />
            <StatCard label="Current plan" value={data.workspace?.current_product?.product_plan_name ?? '—'} hint="Plan associe au produit actuellement prioritaire." tone="admin" icon={CreditCard} />
          </div>
          <ProductGrid products={products} emptyMessage="Aucun produit actif n’est encore rattache a ce client." />
        </>
      ) : null}
    </section>
  );
}
