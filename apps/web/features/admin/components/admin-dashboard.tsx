'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CircleAlert,
  Download,
  FileKey2,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { fetchAdminStats } from '@/lib/api/admin';
import type { AdminStats } from '@/lib/api/types';
import { AuditFeed } from '@/features/admin/components/audit-feed';
import { AccountPanel } from '@/features/admin/components/account-panel';
import { LicenseTable } from '@/features/admin/components/license-table';
import { MonitoringPanel } from '@/features/admin/components/monitoring-panel';
import { OperationsPanel } from '@/features/admin/components/operations-panel';
import { PartnerPanel } from '@/features/admin/components/partner-panel';

export function AdminDashboard() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchAdminStats()
      .then((payload) => {
        if (mounted) {
          setData(payload);
          setError(null);
        }
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError("Session admin absente. Connecte-toi depuis l'espace d'acces.");
          return;
        }
        setError(reason.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const recentLicenses = data?.licenses.slice(0, 5) ?? [];
  const totalPayoutAmount = Number(data?.marketing.totalCommissions ?? 0);
  const topReseller = data?.marketing.topResellers[0] ?? null;
  const pendingPayouts = data?.marketing.payoutBreakdown?.pending ?? data?.marketing.payouts.length ?? 0;

  const quickActions = [
    {
      title: 'Ouvrir produits',
      description: 'Verifier le catalogue global et les plans actifs.',
      href: '/admin/products',
      icon: FileKey2,
    },
    {
      title: 'Controler comptes',
      description: 'Creer ou suspendre des comptes client et reseller.',
      href: '/admin/accounts',
      icon: Users,
    },
    {
      title: 'Suivre resellers',
      description: 'Consulter le ranking et les demandes de payout.',
      href: '/admin/resellers',
      icon: Store,
    },
  ];

  return (
    <section className="space-y-8">
      <SectionHeader
        kicker="Admin control plane"
        title="Admin Overview"
        description="Surface centrale de pilotage pour comptes, licences, resellers et activite plateforme. La lecture est structuree par priorites, activite et gestion detaillee."
        badge="Live migration"
      />

      {loading ? (
        <div className="m3-surface rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">
          Chargement des donnees admin...
        </div>
      ) : null}

      {error ? (
        <div className="m3-surface rounded-[1.5rem] p-6">
          <StatusBadge tone="warning">Acces requis</StatusBadge>
          <h3 className="mt-3 text-[1.7rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
            Le dashboard ne peut pas charger les donnees admin.
          </h3>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">{error}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/auth/admin"
              className="m3-filled-button rounded-full px-5 py-3 text-[13px] font-semibold"
            >
              Se connecter a l’admin
            </Link>
            <a
              href="http://127.0.0.1:3000/admin/dev-login"
              className="m3-outline-button rounded-full px-5 py-3 text-[13px] font-semibold"
            >
              Dev login backend
            </a>
          </div>
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="card-admin rounded-[2rem] p-8 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <p className="m3-label text-[var(--primary)]">Control center</p>
              </div>
              <h3 className="mt-3 text-[2.1rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                Real-time status of J+SERVICES infrastructure
              </h3>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">
                Cette vue priorise les signaux critiques, les actions rapides et l’activite
                recente avant les ecrans de gestion detaillee.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/admin/licenses"
                  className="m3-outline-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
                >
                  <CircleAlert className="size-4" aria-hidden="true" />
                  Today
                </Link>
                <Link
                  href="/admin/products"
                  className="m3-filled-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Export Report
                </Link>
              </div>
            </div>

            <div className="card-neutral rounded-[2rem] p-8 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                  <CircleAlert className="size-5" aria-hidden="true" />
                </span>
                <p className="m3-label">Immediate priorities</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">Licences recentes</p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    {data.licenses.length} entrees disponibles pour verification rapide.
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">Demandes de retrait</p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    {pendingPayouts} demandes a suivre pour validation finance.
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">Top reseller</p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    {topReseller ? `${topReseller.name} domine actuellement le volume commercial.` : 'Aucun reseller dominant disponible.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OperationsPanel data={data} />

          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <div id="monitoring">
                <MonitoringPanel data={data} />
              </div>

              <div className="card-neutral rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                      <FileKey2 className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="m3-label">License operations</p>
                      <p className="mt-1 text-[13px] text-[var(--muted)]">
                        Vue condensée des licences recentes avant le tableau complet.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin/licenses"
                    className="text-[13px] font-semibold text-[var(--primary)]"
                  >
                    Voir tout
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentLicenses.length ? recentLicenses.map((license) => (
                    <article
                      key={license.id}
                      className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/78 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[13px] font-semibold text-[var(--foreground)]">{license.email ?? license.id}</p>
                          <p className="mt-1 text-[12px] text-[var(--muted)]">
                            {license.plan_code ?? 'Plan inconnu'} • {Number(license.amount ?? 0).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                        <StatusBadge
                          tone={license.status === 'ACTIVE' ? 'success' : license.status === 'PENDING' ? 'warning' : 'neutral'}
                        >
                          {license.status ?? 'UNKNOWN'}
                        </StatusBadge>
                      </div>
                    </article>
                  )) : (
                    <p className="text-[13px] text-[var(--muted)]">Aucune licence recente disponible.</p>
                  )}
                </div>
              </div>

              <AuditFeed rows={data.auditLogs} />
            </div>

            <div className="space-y-4">
              <div className="card-neutral rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                  <p className="m3-label">Quick actions</p>
                </div>
                <div className="mt-4 space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="flex items-start gap-3 rounded-[1.1rem] border border-[var(--line-strong)] bg-white/80 p-4 transition hover:-translate-y-[1px]"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary-strong)]">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="block">
                          <span className="block text-[13px] font-semibold text-[var(--foreground)]">{action.title}</span>
                          <span className="mt-1 block text-[13px] leading-6 text-[var(--muted)]">{action.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="card-public rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                <p className="m3-label text-[var(--primary)]">Payout monitoring</p>
                <p className="mt-3 text-[2rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                  {totalPayoutAmount.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                  Commissions consolidees avec {data.marketing.totalResellers ?? 0} resellers suivis dans le control plane.
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">En attente</p>
                    <p className="mt-2 text-[1.3rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">{data.marketing.payoutBreakdown?.pending ?? 0}</p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Valides</p>
                    <p className="mt-2 text-[1.3rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">{data.marketing.payoutBreakdown?.success ?? 0}</p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Echecs</p>
                    <p className="mt-2 text-[1.3rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">{data.marketing.payoutBreakdown?.failed ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="m3-label">Deep operations</p>
                <h3 className="mt-2 text-[1.6rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                  Accounts, licenses and reseller management
                </h3>
              </div>
              <Link
                href="/admin/accounts"
                className="text-[13px] font-semibold text-[var(--primary)]"
              >
                Ouvrir les comptes
              </Link>
            </div>
            <div id="accounts">
              <AccountPanel />
            </div>
            <LicenseTable rows={data.licenses} />
            <PartnerPanel data={data.marketing} />
          </div>
        </>
      ) : null}
    </section>
  );
}
