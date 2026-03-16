'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BadgePercent,
  Blocks,
  ChartColumn,
  Compass,
  Cog,
  CreditCard,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Package,
  RefreshCcw,
  Shield,
  Store,
  Ticket,
  Users,
  WalletCards,
} from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';
import { cn } from '@/lib/cn';
import type { ShellContext } from '@/components/ui/app-shell';

export type ShellNavItem = {
  href: string;
  label: string;
  section?: string;
  icon:
  | 'dashboard'
  | 'monitoring'
  | 'accounts'
  | 'compass'
  | 'ticket'
  | 'shield'
  | 'sales'
  | 'store'
  | 'products'
  | 'settings'
  | 'licenses'
  | 'resellers'
  | 'sync'
  | 'commissions'
  | 'payouts'
  | 'promo'
  | 'stock'
  | 'app';
};

const iconMap = {
  dashboard: LayoutDashboard,
  monitoring: ChartColumn,
  accounts: Users,
  compass: Compass,
  ticket: Ticket,
  shield: Shield,
  sales: HandCoins,
  store: Store,
  products: FolderKanban,
  settings: Cog,
  licenses: CreditCard,
  resellers: Users,
  sync: RefreshCcw,
  commissions: BadgePercent,
  payouts: WalletCards,
  promo: Ticket,
  stock: Package,
  app: Blocks,
} as const;

export function Sidebar({ context }: { context: ShellContext }) {
  const pathname = usePathname();
  const overviewHref = context.navItems[0]?.href;
  const groupedItems = context.navItems.reduce<Array<{ title?: string; items: ShellNavItem[] }>>((groups, item) => {
    const lastGroup = groups.at(-1);

    if (lastGroup && lastGroup.title === item.section) {
      lastGroup.items.push(item);
      return groups;
    }

    groups.push({ title: item.section, items: [item] });
    return groups;
  }, []);

  return (
    <aside className="hidden px-4 py-5 text-[var(--foreground)] lg:flex lg:flex-col">
      <div className="shell-panel shell-panel-strong rounded-[1.75rem] p-5">
        <BrandMark />
        <div className="mt-5 inline-flex items-center rounded-full border border-[var(--line-strong)] bg-white/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--primary)]">
          {context.area}
        </div>
        <h1 className="mt-4 text-[1.45rem] font-black tracking-[-0.05em]">
          {context.title}
        </h1>
        <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
          {context.description}
        </p>
      </div>

      <nav className="shell-panel mt-6 flex flex-col gap-5 rounded-[1.75rem] px-3 py-4" aria-label="Navigation principale">
        {groupedItems.map((group) => (
          <div key={group.title ?? group.items[0]?.href} className="space-y-1.5">
            {group.title ? (
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                {group.title}
              </p>
            ) : null}
            {group.items.map((item) => {
              const Icon = iconMap[item.icon];
              const active =
                pathname === item.href
                || (item.href !== overviewHref && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    'm3-nav-item flex items-center gap-3 px-3.5 py-3 text-[13px] font-semibold transition',
                    active
                      ? 'text-[var(--primary-strong)]'
                      : 'text-[var(--muted)] hover:bg-white/55 hover:text-[var(--foreground)]',
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span className={cn(
                    'flex size-9 items-center justify-center rounded-xl border border-transparent bg-white/55 text-[var(--primary)] transition',
                    active && 'border-[var(--line-strong)] bg-[var(--primary-soft)] text-[var(--primary-strong)]',
                  )}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shell-panel mt-auto rounded-[1.75rem] p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-[1rem] border border-[var(--line-strong)] bg-[var(--primary-soft)] p-2.5 text-[var(--primary-strong)]">
            <ChartColumn className="size-[18px]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">{context.area}</p>
            <p className="text-xs text-[var(--muted)]">Workspace dedie avec navigation et contexte isoles.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
