'use client';

import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useClientDashboard } from '@/features/client/hooks/use-client-dashboard';

export function ClientSettingsPage() {
  const { data, error, loading } = useClientDashboard();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Client settings"
        title="Settings"
        description="Parametres et identite de l’espace client, separes des operations quotidiennes."
        badge="Dedicated page"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des parametres client...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="card-manager rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
            <p className="m3-label">Identity</p>
            <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
              {data.client.display_name || data.client.email}
            </h3>
            <p className="mt-2.5 text-[14px] leading-6 text-[var(--muted)]">
              Email {data.client.email} • statut {data.client.status} • licence {data.client.license_type}
            </p>
          </div>
          <div className="card-neutral rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
            <p className="m3-label">License posture</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone={data.client.license_status?.severity ?? 'neutral'}>
                {data.client.license_status?.label ?? 'Aucun statut'}
              </StatusBadge>
              {data.client.license_key ? <StatusBadge tone="info">{data.client.license_key}</StatusBadge> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
