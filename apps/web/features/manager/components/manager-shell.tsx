'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Blocks,
  BookOpen,
  Compass,
  Gauge,
  Headset,
  HelpCircle,
  Layers3,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Ticket,
  Waves,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { fetchClientDashboard } from '@/lib/api/clients-dashboard';
import type { ClientDashboard, ClientProductAccess } from '@/lib/api/types';

function formatExpiry(rawDate?: string | null) {
  if (!rawDate) return 'Aucune date';
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return 'Date invalide';
  return date.toLocaleDateString('fr-FR');
}

function productVisual(product: ClientProductAccess, index: number) {
  const code = product.product_code?.toUpperCase() ?? '';

  if (code.includes('TIKET') || code.includes('TICKET')) {
    return {
      icon: Ticket,
      gradient: 'from-[var(--primary)] to-cyan-400',
      glow: 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_65%)]',
    };
  }

  if (code.includes('MOMO') || code.includes('PAY')) {
    return {
      icon: Waves,
      gradient: 'from-emerald-500 to-teal-400',
      glow: 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_65%)]',
    };
  }

  return {
    icon: index % 2 === 0 ? Blocks : Sparkles,
    gradient: index % 2 === 0 ? 'from-[var(--primary)] to-indigo-400' : 'from-slate-800 to-slate-600',
    glow: 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_65%)]',
  };
}

export function ClientShell() {
  const [data, setData] = useState<ClientDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;

    fetchClientDashboard()
      .then((payload) => {
        if (!mounted) return;
        setData(payload.data);
        setError(null);
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError('Session client absente. Connecte-toi pour ouvrir le dashboard.');
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

  const profileFilter = searchParams.get('profile') ?? 'all';
  const query = searchParams.get('q') ?? '';

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  return (
    <section className="space-y-6">
      <SectionHeader
        kicker="Client workspace"
        title="Client Insights"
        description="Le workspace client suit maintenant la structure Stitch: vue produit d’abord, puis operations, inventaire, synchronisation et support."
        badge="Live data"
      />

      {loading ? (
        <div className="m3-surface rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">
          Chargement du dashboard client...
        </div>
      ) : null}

      {error ? (
        <div className="m3-glass rounded-[1.5rem] p-6">
          <StatusBadge tone="warning">Acces requis</StatusBadge>
          <h3 className="mt-3 text-[1.7rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
            La vue client est prete, mais la session est absente.
          </h3>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">{error}</p>
        </div>
      ) : null}

      {data ? (
        <>
          {(() => {
            const licenseStatus = data.client.license_status;
            const activeProducts = data.workspace?.active_products ?? data.subscriptions ?? [];
            const currentProduct = data.workspace?.current_product ?? activeProducts[0] ?? null;
            const filteredVouchers = data.vouchers.filter((voucher) => {
              const matchesProfile = profileFilter === 'all' || voucher.profile === profileFilter;
              const matchesQuery =
                !query.trim() || voucher.code.toLowerCase().includes(query.trim().toLowerCase());
              return matchesProfile && matchesQuery;
            });
            const profileOptions = ['all', ...new Set(data.vouchers.map((voucher) => voucher.profile))];
            const recentActivity = [
              {
                label: 'Inventory Synced',
                detail: `${data.sync_summary.last_inserted} items updated automatically`,
                time: data.sync_summary.last_received_at
                  ? new Date(data.sync_summary.last_received_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  : 'recent',
                icon: Waves,
                tone: 'text-[var(--primary)] bg-[var(--primary-soft)]',
              },
              {
                label: 'License Status',
                detail: licenseStatus?.label ?? 'Licence stable',
                time: formatExpiry(data.client.license_expiry_date),
                icon: ShieldCheck,
                tone: 'text-emerald-600 bg-emerald-100/80',
              },
              {
                label: 'Available Stock',
                detail: `${data.inventory.available} vouchers encore disponibles`,
                time: `${data.inventory.used} utilises`,
                icon: Ticket,
                tone: 'text-amber-600 bg-amber-100/80',
              },
            ];

            return (
              <>
                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="card-manager rounded-[1.75rem] p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <Compass className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label text-[var(--primary)]">Workspace overview</p>
                    </div>
                    <h3 className="mt-3 text-[2rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
                      {data.client.display_name || data.client.email}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">
                      Espace de pilotage pour produits actifs, stock vouchers, synchronisation Mikhmo AI et licence.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <span className="m3-tonal-button rounded-full px-4 py-2 text-[13px] font-semibold">
                        Licence {data.client.license_type || 'FREE'}
                      </span>
                      <span className="m3-outline-button rounded-full px-4 py-2 text-[13px] font-semibold">
                        {activeProducts.length} produit(s) actifs
                      </span>
                      <StatusBadge tone={licenseStatus?.severity || 'neutral'}>
                        {licenseStatus?.label || 'Statut licence'}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="card-neutral rounded-[1.75rem] p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label">Current product</p>
                    </div>
                    <h3 className="mt-3 text-[1.7rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                      {currentProduct?.product_name ?? 'Aucun produit actif'}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                      {currentProduct
                        ? `${currentProduct.product_plan_name ?? currentProduct.product_plan_code ?? 'Plan actif'} • route ${currentProduct.default_route ?? '/client'}`
                        : 'Ajoute un produit actif pour ouvrir la section produit et operations.'}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Expiration</p>
                        <p className="mt-2 text-[1.3rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
                          {formatExpiry(data.client.license_expiry_date)}
                        </p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Stock dispo</p>
                        <p className="mt-2 text-[1.3rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
                          {data.inventory.available}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Monthly Sales"
                    value={`${data.inventory.used}`}
                    hint="Volume de distribution observe sur les vouchers utilises."
                    tone="manager"
                    icon={Gauge}
                  />
                  <StatCard
                    label="Active Tickets"
                    value={String(data.vouchers.length)}
                    hint="Codes vouchers presents dans le workspace."
                    tone="public"
                    icon={Ticket}
                  />
                  <StatCard
                    label="Stock Items"
                    value={String(data.inventory.available)}
                    hint="Inventaire immediatement distribuable."
                    tone="admin"
                    icon={Layers3}
                  />
                  <StatCard
                    label="Total Licenses"
                    value={`${activeProducts.length} Active`}
                    hint={`Licence ${data.client.license_type || 'FREE'} • expiration ${formatExpiry(data.client.license_expiry_date)}`}
                    tone="partner"
                    icon={ShieldCheck}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="m3-label">My products</p>
                      <h3 className="mt-2 text-[1.6rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                        Produits actifs dans ton ecosysteme
                      </h3>
                    </div>
                    <Link href="/client/products" className="text-[13px] font-semibold text-[var(--primary)]">
                      View All
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {activeProducts.map((product, index) => {
                      const visual = productVisual(product, index);
                      const Icon = visual.icon;
                      return (
                        <article key={product.id} className="card-neutral group relative flex flex-col rounded-[2rem] p-5 shadow-[var(--shadow-card)]">
                          <div className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-tr ${visual.gradient}`}>
                            <div className={`absolute inset-0 opacity-90 ${visual.glow}`} />
                            <Icon className="relative z-10 size-12 text-white drop-shadow-lg" aria-hidden="true" />
                          </div>
                          <div className="mt-5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                                {product.product_name}
                              </h3>
                              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <ShieldCheck className="size-4" aria-hidden="true" />
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                              {product.product_plan_name ?? product.product_type}
                            </p>
                            <div className="mt-5 flex items-center gap-2">
                              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-strong)]">
                                {product.product_plan_code ?? 'Active'}
                              </span>
                              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                {product.default_route ?? '/client'}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={product.default_route ?? '/client/products'}
                            className="mt-6 rounded-[1rem] bg-slate-900 py-3 text-center text-sm font-bold text-white transition-all hover:bg-[var(--primary)] hover:shadow-lg hover:shadow-[rgba(17,82,212,0.28)]"
                          >
                            Manage Infrastructure
                          </Link>
                        </article>
                      );
                    })}

                    <article className="flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[var(--line-strong)] p-8 transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40">
                      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white/80 text-[var(--muted)] transition-all">
                        <PlusCircle className="size-8" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-[var(--foreground)]">Add New Product</h3>
                      <p className="mt-1 text-center text-sm text-[var(--muted)]">
                        Etends ton ecosysteme et ouvre de nouveaux modules.
                      </p>
                      <Link href="/client/products" className="mt-6 font-bold text-[var(--primary)]">
                        Browse Marketplace
                      </Link>
                    </article>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="space-y-4">
                    <div className="card-admin rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                          <Layers3 className="size-5" aria-hidden="true" />
                        </span>
                        <p className="m3-label">Inventory & sales</p>
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-[var(--muted)]">
                        Vue par profil pour suivre les vouchers recus depuis Mikhmo AI et les points de tension sur le stock.
                      </p>
                    </div>

                    <DataTable
                      rows={data.inventory.profiles}
                      emptyMessage="Aucun profil voucher detecte."
                      tone="manager"
                      columns={[
                        { key: 'profile', header: 'Profil' },
                        { key: 'total', header: 'Total' },
                        { key: 'available', header: 'Disponibles' },
                        { key: 'used', header: 'Utilises' },
                      ]}
                    />
                  </div>

                  <div className="card-public rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
                        <Sparkles className="size-5" aria-hidden="true" />
                      </span>
                      <p className="m3-label text-[var(--primary)]">Recommendations</p>
                    </div>
                    <h3 className="mt-3 text-[1.7rem] font-black tracking-[-0.04em] text-[var(--foreground)]">
                      Derniers vouchers recus
                    </h3>
                    <div className="mt-4 space-y-3">
                      {data.vouchers.slice(0, 4).map((voucher) => (
                        <div key={voucher.id} className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[13px] font-semibold text-[var(--foreground)]">{voucher.profile}</p>
                            <StatusBadge tone={voucher.used ? 'warning' : 'success'}>
                              {voucher.used ? 'Utilise' : 'Disponible'}
                            </StatusBadge>
                          </div>
                          <p className="mt-1 text-[13px] text-[var(--muted)]">
                            {voucher.code} • {voucher.price.toLocaleString('fr-FR')} FCFA
                          </p>
                          <p className="mt-1 text-[12px] text-[var(--muted)]">
                            {voucher.created_at ? new Date(voucher.created_at).toLocaleString('fr-FR') : 'Date inconnue'}
                          </p>
                        </div>
                      ))}
                      {!data.vouchers.length ? (
                        <p className="text-[13px] leading-6 text-[var(--muted)]">
                          Aucun voucher synchronise pour le moment.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    <div className="card-neutral rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="m3-label">Voucher inventory</p>
                          <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                            Recherche rapide et filtre par profil sur les vouchers recus depuis Mikhmo AI.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row">
                          <input
                            name="voucher_query"
                            aria-label="Rechercher un code voucher"
                            autoComplete="off"
                            spellCheck={false}
                            value={query}
                            onChange={(event) => updateFilters({ q: event.target.value || null })}
                            placeholder="Rechercher un code..."
                            className="rounded-[1rem] border border-[var(--line-strong)] bg-white/85 px-4 py-3 text-[13px] outline-none"
                          />
                          <select
                            name="voucher_profile"
                            aria-label="Filtrer les vouchers par profil"
                            value={profileFilter}
                            onChange={(event) => updateFilters({ profile: event.target.value })}
                            className="rounded-[1rem] border border-[var(--line-strong)] bg-white/85 px-4 py-3 text-[13px] outline-none"
                          >
                            {profileOptions.map((option) => (
                              <option key={option} value={option}>
                                {option === 'all' ? 'Tous les profils' : option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <DataTable
                      rows={filteredVouchers}
                      emptyMessage="Aucun voucher pour ce filtre."
                      tone="manager"
                      columns={[
                        { key: 'code', header: 'Code' },
                        { key: 'profile', header: 'Profil' },
                        {
                          key: 'price',
                          header: 'Prix',
                          render: (row) => `${row.price.toLocaleString('fr-FR')} FCFA`,
                        },
                        {
                          key: 'duration_minutes',
                          header: 'Duree',
                          render: (row) => `${row.duration_minutes || 0} min`,
                        },
                        {
                          key: 'site_id',
                          header: 'Site',
                          render: (row) => row.site_id || 'Defaut',
                        },
                        {
                          key: 'used',
                          header: 'Etat',
                          render: (row) => (
                            <StatusBadge tone={row.used ? 'warning' : 'success'}>
                              {row.used ? 'Utilise' : 'Disponible'}
                            </StatusBadge>
                          ),
                        },
                      ]}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="card-public rounded-[1.75rem] p-5 shadow-[var(--shadow-card)]">
                      <p className="m3-label text-[var(--primary)]">Sync history</p>
                      <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                        Historique des derniers stocks recus depuis Mikhmo AI vers le backend.
                      </p>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Last sync</p>
                          <p className="mt-2 text-[1.4rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
                            {data.sync_summary.last_received_at
                              ? new Date(data.sync_summary.last_received_at).toLocaleDateString('fr-FR')
                              : 'Aucun'}
                          </p>
                        </div>
                        <div className="rounded-[1rem] border border-[var(--line-strong)] bg-white/80 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Last status</p>
                          <div className="mt-2">
                            <StatusBadge tone={data.sync_summary.last_status === 'COMPLETED' ? 'success' : 'warning'}>
                              {data.sync_summary.last_status}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DataTable
                      rows={data.sync_jobs}
                      emptyMessage="Aucune synchronisation recente."
                      tone="public"
                      columns={[
                        {
                          key: 'created_at',
                          header: 'Date',
                          render: (row) =>
                            row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '—',
                        },
                        { key: 'source', header: 'Source' },
                        {
                          key: 'batch_size',
                          header: 'Lot',
                          render: (row) => `${row.batch_size} vouchers`,
                        },
                        {
                          key: 'status',
                          header: 'Etat',
                          render: (row) => (
                            <StatusBadge tone={row.status === 'COMPLETED' ? 'success' : 'warning'}>
                              {row.status}
                            </StatusBadge>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="card-neutral rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Support Center</h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">Need help with your workspace or products?</p>
                      </div>
                      <div className="rounded-xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">
                        <HelpCircle className="size-5" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Link className="flex items-center gap-3 rounded-xl border border-[var(--line-strong)] p-4 transition-colors hover:bg-white/70" href="/client/settings">
                        <BookOpen className="size-4 text-[var(--muted)]" aria-hidden="true" />
                        <span className="text-sm font-medium">Knowledge Base</span>
                      </Link>
                      <Link className="flex items-center gap-3 rounded-xl border border-[var(--line-strong)] p-4 transition-colors hover:bg-white/70" href="/client/tiketmomo">
                        <Ticket className="size-4 text-[var(--muted)]" aria-hidden="true" />
                        <span className="text-sm font-medium">Submit Ticket</span>
                      </Link>
                      <Link className="flex items-center gap-3 rounded-xl border border-[var(--line-strong)] p-4 transition-colors hover:bg-white/70" href="/client/settings">
                        <MessageSquare className="size-4 text-[var(--muted)]" aria-hidden="true" />
                        <span className="text-sm font-medium">Live Chat</span>
                      </Link>
                      <Link className="flex items-center gap-3 rounded-xl border border-[var(--line-strong)] p-4 transition-colors hover:bg-white/70" href="/client/products">
                        <Headset className="size-4 text-[var(--muted)]" aria-hidden="true" />
                        <span className="text-sm font-medium">Community</span>
                      </Link>
                    </div>
                  </div>

                  <div className="card-neutral rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Recent Activity</h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">Latest actions in the workspace.</p>
                      </div>
                      <button type="button" className="text-[var(--muted)]">
                        <Sparkles className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-6 space-y-6">
                      {recentActivity.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center gap-4">
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                              <Icon className="size-4" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-[var(--muted)]">{item.detail}</p>
                            </div>
                            <span className="text-xs text-[var(--muted)]">{item.time}</span>
                          </div>
                        );
                      })}
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

export { ClientShell as ManagerShell };
