'use client';

import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { useResellerDashboard } from '@/features/reseller/hooks/use-reseller-dashboard';

export function ResellerSettingsPage() {
  const { data, error, loading } = useResellerDashboard();

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Reseller settings"
        title="Settings"
        description="Parametres et identite du reseller, hors des vues ventes et commissions."
        badge="Dedicated page"
      />
      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des parametres reseller...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}
      {data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="card-partner rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
            <p className="m3-label">Identity</p>
            <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
              {data.reseller.name}
            </h3>
            <p className="mt-2.5 text-[14px] leading-6 text-[var(--muted)]">
              {data.reseller.email} • promo {data.reseller.promo_code}
            </p>
          </div>
          <div className="card-neutral rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
            <p className="m3-label">Commercial posture</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="info">{data.reseller.commission_rate ?? 0}%</StatusBadge>
              <StatusBadge tone="success">{Number(data.reseller.balance ?? 0).toLocaleString('fr-FR')} FCFA</StatusBadge>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
