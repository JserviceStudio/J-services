'use client';

import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useClientDashboard } from '@/features/client/hooks/use-client-dashboard';
import { Gauge, Layers3, Ticket } from 'lucide-react';

export function ClientTiketMomoPage() {
  const { data, error, loading } = useClientDashboard();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Product workspace"
        title="TiketMomo"
        description="Dashboard produit dedie au premier module actif de l’ecosysteme client."
        badge="Product app"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement de TiketMomo...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Stock total" value={String(data.inventory.total)} hint="Vouchers connus pour TiketMomo." tone="manager" icon={Layers3} />
            <StatCard label="Disponibles" value={String(data.inventory.available)} hint="Stock encore vendable ou distribuable." tone="public" icon={Ticket} />
            <StatCard label="Dernier sync" value={data.sync_summary.last_status} hint={data.sync_summary.source} tone="admin" icon={Gauge} />
          </div>
          <div className="card-manager rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
            <p className="m3-label">Product focus</p>
            <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
              TiketMomo reste le premier dashboard produit branche.
            </h3>
            <p className="mt-2.5 text-[14px] leading-6 text-[var(--muted)]">
              La structure frontend est maintenant prete pour accueillir d’autres dashboards
              produit dans ce meme workspace client, sans repasser par une page unique.
            </p>
          </div>
        </>
      ) : null}
    </section>
  );
}
