'use client';

import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats';

export function AdminSettingsPage() {
  const { data, error, loading } = useAdminStats();
  const configEntries = Object.entries(data?.config ?? {}).slice(0, 8);

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Platform settings"
        title="Settings"
        description="Configuration centrale de la plateforme et reperes de pilotage admin."
        badge="Dedicated page"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des parametres...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-admin rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
          <p className="m3-label">Current posture</p>
          <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
            Control plane J+SERVICES
          </h3>
          <p className="mt-2.5 text-[14px] leading-6 text-[var(--muted)]">
            Cette page devient l’entree naturelle pour les parametres globaux, les regles
            de plateforme et la gouvernance multi-produit.
          </p>
        </div>
        <div className="card-neutral rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
          <p className="m3-label">Loaded config keys</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {configEntries.length ? configEntries.map(([key]) => (
              <StatusBadge key={key} tone="info">{key}</StatusBadge>
            )) : (
              <p className="text-[13px] text-[var(--muted)]">Aucune cle chargee pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
