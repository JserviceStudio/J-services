'use client';

import { BadgePercent, FolderKanban, WalletCards } from 'lucide-react';
import { ProductGrid } from '@/components/ui/product-grid';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useResellerDashboard } from '@/features/reseller/hooks/use-reseller-dashboard';

export function ResellerCatalogPage() {
  const { data, error, loading } = useResellerDashboard();
  const products = (data?.workspace?.sellable_products ?? []).map((product) => ({
    id: product.id,
    code: product.product_code,
    name: product.product_name,
    product_type: product.product_type,
    status: product.status,
    product_plan_name: product.product_plan_name,
    product_plan_code: product.product_plan_code,
    commission_type: product.commission_type,
    commission_value: product.commission_value,
  }));

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Commercial catalog"
        title="Sellable Products"
        description="Catalogue reel des produits et plans que ce reseller peut vendre."
        badge="Permission driven"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement du catalogue reseller...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Products" value={String(data.workspace?.products_count ?? 0)} hint="Produits vendables pour ce reseller." tone="partner" icon={FolderKanban} />
            <StatCard label="Pending payouts" value={String(data.summary?.pending_payouts ?? 0)} hint="Demandes encore ouvertes." tone="admin" icon={WalletCards} />
            <StatCard label="Average commission" value={`${Math.round(data.summary?.average_commission ?? 0)}`} hint="Commission moyenne par vente recente." tone="public" icon={BadgePercent} />
          </div>
          <ProductGrid products={products} emptyMessage="Aucun produit n’est encore autorise pour ce reseller." />
        </>
      ) : null}
    </section>
  );
}
