import { Blocks, CreditCard, Route } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

type ProductCard = {
  id: string;
  code: string;
  name: string;
  product_type: string;
  status: string;
  default_route?: string | null;
  plans_count?: number;
  apps_count?: number;
  active_clients_count?: number;
  active_resellers_count?: number;
  product_plan_name?: string | null;
  product_plan_code?: string | null;
  commission_type?: string;
  commission_value?: number;
};

const toneByStatus = {
  ACTIVE: 'success',
  PENDING: 'warning',
  DRAFT: 'info',
  SUSPENDED: 'warning',
  EXPIRED: 'danger',
  DISABLED: 'danger',
  ARCHIVED: 'neutral',
  CANCELLED: 'danger',
} as const;

function getTone(status?: string) {
  const normalized = String(status ?? 'neutral').toUpperCase() as keyof typeof toneByStatus;
  return toneByStatus[normalized] ?? 'neutral';
}

export function ProductGrid({
  products,
  emptyMessage,
}: {
  products: ProductCard[];
  emptyMessage: string;
}) {
  if (!products.length) {
    return (
      <div className="card-neutral rounded-[1.5rem] p-6 text-[13px] leading-6 text-[var(--muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.map((product) => (
        <article key={product.id} className="card-neutral rounded-[1.65rem] p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-[var(--primary-soft)] text-[var(--primary-strong)]">
                <Blocks className="size-5" aria-hidden="true" />
              </div>
              <div>
              <p className="m3-label">{product.product_type.replaceAll('_', ' ')}</p>
              <h3 className="mt-2 text-[1.4rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
                {product.name}
              </h3>
              <p className="mt-1 text-[13px] text-[var(--muted)]">{product.code}</p>
              </div>
            </div>
            <StatusBadge tone={getTone(product.status)}>{product.status}</StatusBadge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/70 p-3.5">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <Blocks className="size-4" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Plans
                </span>
              </div>
              <p className="mt-2 text-[1.4rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
                {product.plans_count ?? product.product_plan_name ?? '—'}
              </p>
              <p className="mt-1 text-[12px] text-[var(--muted)]">
                {product.product_plan_code ? `Code ${product.product_plan_code}` : 'Configuration commerciale'}
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-[var(--line-strong)] bg-white/70 p-3.5">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <CreditCard className="size-4" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Usage
                </span>
              </div>
              <p className="mt-2 text-[1.4rem] font-bold tracking-[-0.04em] text-[var(--foreground)]">
                {product.active_clients_count ?? product.commission_value ?? product.apps_count ?? '—'}
              </p>
              <p className="mt-1 text-[12px] text-[var(--muted)]">
                {product.commission_type
                  ? `Commission ${product.commission_type}`
                  : `${product.apps_count ?? 0} app(s) techniques liees`}
              </p>
            </div>
          </div>

          {product.default_route ? (
            <div className="mt-4 flex items-center gap-2 text-[13px] text-[var(--muted)]">
              <Route className="size-4 text-[var(--primary)]" aria-hidden="true" />
              <span>Entree par defaut: {product.default_route}</span>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
