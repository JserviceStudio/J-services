'use client';

import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useResellerDashboard } from '@/features/reseller/hooks/use-reseller-dashboard';

export function ResellerPayoutsPage() {
  const { data, error, loading } = useResellerDashboard();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Cash out"
        title="Payouts"
        description="Suivi des retraits et de leur statut, dans une page separee du dashboard global."
        badge="Dedicated page"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des retraits...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <DataTable
          tone="partner"
          rows={data.payouts}
          emptyMessage="Aucune demande de retrait."
          columns={[
            { key: 'id', header: 'Reference' },
            { key: 'amount', header: 'Montant' },
            { key: 'operator', header: 'Operateur' },
            { key: 'payout_status', header: 'Statut' },
            { key: 'created_at', header: 'Creation' },
          ]}
        />
      ) : null}
    </section>
  );
}
