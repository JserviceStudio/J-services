'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { fetchAdminWorkspaceAccounts } from '@/lib/api/admin';
import type { AdminWorkspaceAccounts } from '@/lib/api/types';

export function AdminAccountsPage() {
  const [data, setData] = useState<AdminWorkspaceAccounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAdminWorkspaceAccounts()
      .then((payload) => {
        if (!mounted) return;
        setData(payload);
      })
      .catch((reason: Error) => {
        if (!mounted) return;
        setError(reason.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-5">
      <SectionHeader
        kicker="Accounts orchestration"
        title="Accounts"
        description="Gestion separee des clients et des resellers dans la plateforme centrale."
        badge="Workspace route"
      />

      {loading ? <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement des comptes...</div> : null}
      {error ? <div className="card-neutral rounded-[1.5rem] p-6"><StatusBadge tone="warning">{error}</StatusBadge></div> : null}

      {data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <DataTable
            tone="admin"
            rows={data.clients}
            emptyMessage="Aucun client disponible."
            columns={[
              { key: 'email', header: 'Client' },
              { key: 'display_name', header: 'Nom' },
              { key: 'license_type', header: 'Licence' },
              { key: 'status', header: 'Statut' },
            ]}
          />
          <DataTable
            tone="partner"
            rows={data.resellers}
            emptyMessage="Aucun reseller disponible."
            columns={[
              { key: 'name', header: 'Reseller' },
              { key: 'email', header: 'Email' },
              { key: 'promo_code', header: 'Promo' },
              { key: 'balance', header: 'Solde' },
            ]}
          />
        </div>
      ) : null}
    </section>
  );
}
