'use client';

import { PartnerPanel } from '@/features/admin/components/partner-panel';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats';

export function AdminResellersPage() {
  const { data, error, loading } = useAdminStats();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Commercial network"
        title="Resellers"
        description="Supervision des resellers, commissions et demandes de retraits dans une page dediee."
        badge="Separated section"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement du reseau reseller...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? <PartnerPanel data={data.marketing} /> : null}
    </section>
  );
}
