'use client';

import { Blocks, Route, Users } from 'lucide-react';
import { ProductGrid } from '@/components/ui/product-grid';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats';

export function AdminProductsPage() {
  const { data, error, loading } = useAdminStats();
  const catalog = data?.catalog;

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Platform catalog"
        title="Products Catalog"
        description="Catalogue central des produits et services J+SERVICES, avec leur empreinte technique et leur activation commerciale."
        badge="Admin managed"
      />

      {loading ? (
        <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">
          Chargement du catalogue produit...
        </div>
      ) : null}

      {error ? (
        <div className="card-neutral rounded-[1.5rem] p-6">
          <StatusBadge tone="warning">Acces requis</StatusBadge>
          <p className="mt-3 text-[14px] leading-6 text-[var(--muted)]">{error}</p>
        </div>
      ) : null}

      {catalog ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Products"
              value={String(catalog.summary.total_products)}
              hint="Produits exposes dans la plateforme."
              tone="admin"
              icon={Blocks}
            />
            <StatCard
              label="Active"
              value={String(catalog.summary.active_products)}
              hint="Produits actuellement activables."
              tone="public"
              icon={Route}
            />
            <StatCard
              label="Plans"
              value={String(catalog.summary.total_product_plans)}
              hint="Nombre de plans commerciaux disponibles."
              tone="manager"
              icon={Blocks}
            />
            <StatCard
              label="Reach"
              value={String(catalog.products.reduce((sum, item) => sum + Number(item.active_clients_count ?? 0), 0))}
              hint="Clients actifs sur l’ensemble du catalogue."
              tone="partner"
              icon={Users}
            />
          </div>
          <ProductGrid
            products={catalog.products}
            emptyMessage="Aucun produit n’est encore expose dans le catalogue plateforme."
          />
        </>
      ) : null}
    </section>
  );
}
