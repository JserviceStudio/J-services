'use client';

import { LicenseTable } from '@/features/admin/components/license-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats';

export function AdminLicensesPage() {
  const { data, error, loading } = useAdminStats();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Licensing"
        title="Licenses"
        description="Vue dediee aux licences recentes et a leur rattachement aux clients actifs."
        badge="Catalog aware"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des licences...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? <LicenseTable rows={data.licenses} /> : null}
    </section>
  );
}
