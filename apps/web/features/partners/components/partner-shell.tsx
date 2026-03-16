'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  BadgePercent,
  CircleDollarSign,
  CircleGauge,
  Cloud,
  HandCoins,
  ReceiptText,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { fetchResellerDashboard } from '@/lib/api/reseller';
import type { ResellerDashboard, ResellerProductPermission } from '@/lib/api/types';

type SalesWindow = '7d' | '30d' | 'all';
type PayoutFilter = 'all' | 'pending' | 'success' | 'failed';

function normalizePayoutStatus(status?: string) {
  const normalized = String(status ?? 'PENDING').toUpperCase();

  if (normalized === 'SUCCESS') {
    return { label: 'Paid', tone: 'success' as const, group: 'success' as const };
  }

  if (normalized === 'FAILED' || normalized === 'REJECTED' || normalized === 'CANCELLED') {
    return { label: 'Refunded', tone: 'danger' as const, group: 'failed' as const };
  }

  return { label: 'Pending', tone: 'warning' as const, group: 'pending' as const };
}

function isWithinWindow(dateValue: string | undefined, window: SalesWindow) {
  if (window === 'all') return true;

  const timestamp = new Date(dateValue ?? 0).getTime();
  if (!Number.isFinite(timestamp) || timestamp <= 0) return false;

  const days = window === '7d' ? 7 : 30;
  return timestamp >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function productVisual(product: ResellerProductPermission, index: number) {
  const code = product.product_code?.toUpperCase() ?? '';

  if (code.includes('CLOUD')) {
    return { icon: Cloud, gradient: 'from-[var(--primary)] to-cyan-400' };
  }

  if (code.includes('SECURITY') || code.includes('SEC')) {
    return { icon: Shield, gradient: 'from-violet-500 to-indigo-500' };
  }

  return {
    icon: index % 2 === 0 ? Rocket : Sparkles,
    gradient: index % 2 === 0 ? 'from-[var(--primary)] to-indigo-400' : 'from-emerald-500 to-teal-400',
  };
}

export function ResellerShell() {
  const [data, setData] = useState<ResellerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;

    fetchResellerDashboard()
      .then((payload) => {
        if (!mounted) return;
        setData(payload.data);
        setError(null);
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError('Session partenaire absente. Connecte-toi pour ouvrir le portail.');
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

  const salesWindow = (searchParams.get('window') as SalesWindow | null) ?? '30d';
  const payoutFilter = (searchParams.get('payout') as PayoutFilter | null) ?? 'all';

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all' || (key === 'window' && value === '30d')) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const filteredSales = (data?.sales ?? []).filter((sale) =>
    isWithinWindow(sale.sale_date ?? sale.commission_date, salesWindow),
  );

  const filteredPayouts = (data?.payouts ?? []).filter((payout) => {
    if (payoutFilter === 'all') return true;
    return normalizePayoutStatus(payout.status).group === payoutFilter;
  });

  const filteredSalesAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.amount ?? 0), 0);

  return (
    <section className="space-y-6">
      <SectionHeader
        kicker="Reseller workspace"
        title="Reseller Portal"
        description="Le portail reseller adopte maintenant une structure commerce-first: hero stats, top selling products, recent commissions, payouts et promo performance."
        badge="Live migration"
      />

      {loading ? (
        <div className="m3-surface rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">
          Chargement des donnees reseller...
        </div>
      ) : null}

      {error ? (
        <div className="m3-glass rounded-[1.5rem] p-6">
          <StatusBadge tone="warning">Acces requis</StatusBadge>
          <h3 className="mt-3 text-[1.7rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
            Le portail reseller est pret, mais la session est absente.
          </h3>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">{error}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/auth/reseller"
              className="m3-filled-button rounded-full px-5 py-3 text-[13px] font-semibold"
            >
              Se connecter
            </Link>
            <a
              href="http://127.0.0.1:3000/resellers/auth"
              className="m3-outline-button rounded-full px-5 py-3 text-[13px] font-semibold"
            >
              Auth backend
            </a>
          </div>
        </div>
      ) : null}

      {data ? (
        <>
          {(() => {
            const sellableProducts = data.workspace?.sellable_products ?? data.permissions ?? [];

            return (
              <>
                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="card-partner rounded-[1.75rem] p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <CircleGauge className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label text-[var(--primary)]">Reseller overview</p>
                    </div>
                    <h3 className="mt-3 text-[2rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                      {data.reseller.name}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">
                      Ton code promo actif est <strong>{data.reseller.promo_code}</strong>. Utilise ce portail pour suivre tes ventes, retraits et performances commerciales.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <span className="m3-tonal-button rounded-full px-4 py-2 text-[13px] font-semibold">
                        Promo {data.reseller.promo_code}
                      </span>
                      <span className="m3-outline-button rounded-full px-4 py-2 text-[13px] font-semibold">
                        Commission {Number(data.reseller.commission_rate ?? 0)}%
                      </span>
                    </div>
                  </div>

                  <div className="card-neutral rounded-[1.75rem] p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <Sparkles className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label">Immediate priorities</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                        <p className="text-[13px] font-semibold text-[var(--foreground)]">Solde retirable</p>
                        <p className="mt-1 text-[13px] text-[var(--muted)]">
                          {Number(data.reseller.balance ?? 0).toLocaleString('fr-FR')} FCFA disponibles.
                        </p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                        <p className="text-[13px] font-semibold text-[var(--foreground)]">Produits vendables</p>
                        <p className="mt-1 text-[13px] text-[var(--muted)]">
                          {sellableProducts.length} produit(s) autorises pour ton catalogue.
                        </p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                        <p className="text-[13px] font-semibold text-[var(--foreground)]">Retraits</p>
                        <p className="mt-1 text-[13px] text-[var(--muted)]">
                          {data.payouts.length} demandes recentes remontees par le backend.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard
                    label="Total Revenue"
                    value={`${Number(data.reseller.balance ?? 0).toLocaleString('fr-FR')} FCFA`}
                    hint="Montant actuellement disponible pour retrait."
                    tone="partner"
                    icon={CircleDollarSign}
                  />
                  <StatCard
                    label="Monthly Commissions"
                    value={`${Number(data.summary?.commissions_this_month ?? 0).toLocaleString('fr-FR')} FCFA`}
                    hint="Commissions creditees sur la periode courante."
                    tone="public"
                    icon={BadgePercent}
                  />
                  <StatCard
                    label="Pending Payouts"
                    value={`${data.summary?.pending_payouts ?? 0}`}
                    hint="Demandes de retrait encore ouvertes."
                    tone="admin"
                    icon={HandCoins}
                  />
                </div>

                <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Top Selling Products</h3>
                      <Link href="/reseller/catalog" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                        View All
                      </Link>
                    </div>
                    <div className="card-neutral overflow-hidden rounded-[1.9rem] p-0 shadow-[var(--shadow-card)]">
                      <div className="divide-y divide-[var(--line)]">
                        {sellableProducts.length ? sellableProducts.slice(0, 4).map((product, index) => {
                          const visual = productVisual(product, index);
                          const Icon = visual.icon;
                          const salesCount = filteredSales.filter((sale) =>
                            (sale.license?.plan_code ?? sale.transaction_type ?? '').toUpperCase() === (product.product_plan_code ?? '').toUpperCase(),
                          ).length;
                          const commissionAmount = filteredSales
                            .filter((sale) =>
                              (sale.license?.plan_code ?? sale.transaction_type ?? '').toUpperCase() === (product.product_plan_code ?? '').toUpperCase(),
                            )
                            .reduce((sum, sale) => sum + Number(sale.amount ?? 0), 0);

                          return (
                            <article key={product.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-white/45">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                <div className={`flex h-full w-full items-center justify-center bg-gradient-to-tr ${visual.gradient} text-white`}>
                                  <Icon className="size-5" aria-hidden="true" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">{product.product_name}</p>
                                <p className="text-xs text-[var(--muted)]">{salesCount} sales this month</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-emerald-600">{commissionAmount.toLocaleString('fr-FR')} FCFA</p>
                                <p className="text-[10px] text-[var(--muted)]">Commission</p>
                              </div>
                            </article>
                          );
                        }) : (
                          <div className="p-6 text-[13px] text-[var(--muted)]">Aucun produit vendable disponible.</div>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Recent Commissions</h3>
                      <div className="flex gap-2">
                        <button type="button" className="m3-outline-button rounded-lg px-3 py-1.5 text-xs font-semibold">
                          Export CSV
                        </button>
                        <Link href="/reseller/payouts" className="m3-filled-button rounded-lg px-3 py-1.5 text-xs font-semibold">
                          See Invoices
                        </Link>
                      </div>
                    </div>
                    <DataTable
                      rows={filteredSales}
                      emptyMessage="Aucune vente pour le moment."
                      tone="partner"
                      columns={[
                        {
                          key: 'reference',
                          header: 'Transaction ID',
                          render: (row) => String(row.reference || '—').slice(0, 12).toUpperCase(),
                        },
                        {
                          key: 'license',
                          header: 'Product',
                          render: (row) => row.license?.plan_code || row.transaction_type || '—',
                        },
                        {
                          key: 'sale_date',
                          header: 'Date',
                          render: (row) => row.sale_date ? new Date(row.sale_date).toLocaleDateString('fr-FR') : '—',
                        },
                        {
                          key: 'status',
                          header: 'Status',
                          render: (row) => (
                            <StatusBadge tone={row.transaction_status === 'SUCCESS' ? 'success' : 'warning'}>
                              {row.transaction_status === 'SUCCESS' ? 'Paid' : row.transaction_status || 'Pending'}
                            </StatusBadge>
                          ),
                        },
                        {
                          key: 'amount',
                          header: 'Commission',
                          render: (row) => `${Number(row.amount ?? 0).toLocaleString('fr-FR')} FCFA`,
                        },
                      ]}
                    />
                  </section>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                  <div className="card-neutral rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <TrendingUp className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label">Sales focus</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['7d', '30d', 'all'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateFilters({ window: option })}
                          className={
                            salesWindow === option
                              ? 'm3-filled-button rounded-full px-4 py-2 text-[12px] font-semibold'
                              : 'm3-outline-button rounded-full px-4 py-2 text-[12px] font-semibold'
                          }
                        >
                          {option === '7d' ? '7 jours' : option === '30d' ? '30 jours' : 'Tout'}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-[2rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                      {Number(filteredSalesAmount).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                      {filteredSales.length} ventes sur la fenetre active <strong>{salesWindow}</strong>.
                    </p>
                  </div>

                  <div className="card-public rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <ReceiptText className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label text-[var(--primary)]">Payout monitoring</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {([
                        ['all', 'Tous'],
                        ['pending', 'En attente'],
                        ['success', 'Valides'],
                        ['failed', 'Echecs'],
                      ] as const).map(([option, label]) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateFilters({ payout: option })}
                          className={
                            payoutFilter === option
                              ? 'm3-filled-button rounded-full px-4 py-2 text-[12px] font-semibold'
                              : 'm3-outline-button rounded-full px-4 py-2 text-[12px] font-semibold'
                          }
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-[2rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                      {filteredPayouts.length}
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                      Retraits visibles pour le filtre <strong>{payoutFilter}</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div id="payouts" className="space-y-4">
                    <DataTable
                      rows={filteredPayouts}
                      emptyMessage="Aucun retrait recent."
                      tone="public"
                      columns={[
                        {
                          key: 'created_at',
                          header: 'Date',
                          render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '—',
                        },
                        {
                          key: 'amount',
                          header: 'Montant',
                          render: (row) => `${Number(row.amount ?? 0).toLocaleString('fr-FR')} FCFA`,
                        },
                        { key: 'phone_number', header: 'Telephone' },
                        {
                          key: 'operator',
                          header: 'Operateur',
                          render: (row) => row.operator || '—',
                        },
                        {
                          key: 'status',
                          header: 'Statut',
                          render: (row) => {
                            const payoutStatus = normalizePayoutStatus(row.status);
                            return <StatusBadge tone={payoutStatus.tone}>{payoutStatus.label}</StatusBadge>;
                          },
                        },
                      ]}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="card-admin rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                      <p className="m3-label">Promo activation</p>
                      <p className="mt-3 text-[1.9rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                        {data.summary?.sales_count ?? 0}
                      </p>
                      <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                        Utilisations commerciales visibles du code <strong>{data.reseller.promo_code}</strong>.
                      </p>
                    </div>
                    <div className="card-neutral rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                      <p className="m3-label">Average commission</p>
                      <p className="mt-3 text-[1.9rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                        {Number(data.summary?.average_commission ?? 0).toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                        Valeur moyenne par vente commissionnee sur l’historique recent.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </>
      ) : null}
    </section>
  );
}

export { ResellerShell as PartnerShell };
