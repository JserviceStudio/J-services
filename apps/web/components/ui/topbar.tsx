'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';
import { StatusBadge } from '@/components/ui/status-badge';
import type { ShellContext } from '@/components/ui/app-shell';

export function Topbar({ context }: { context: ShellContext }) {
  const pathname = usePathname();
  const overviewHref = context.navItems[0]?.href;
  const currentItem = context.navItems.find(
    (item) => pathname === item.href || (item.href !== overviewHref && pathname.startsWith(`${item.href}/`)),
  ) ?? context.navItems[0];
  const isOverview = pathname === context.navItems[0]?.href;

  return (
    <header className="shell-panel relative z-10 flex flex-col gap-4 rounded-[1.75rem] px-4 py-4 md:flex-row md:items-center md:justify-between pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4">
        <BrandMark compact className="md:hidden" />
        <div className="hidden md:block min-w-0">
          <p className="m3-label">
            {context.area}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-[1.1rem] font-black tracking-[-0.045em] text-[var(--foreground)]">
              {currentItem?.label ?? context.title}
            </p>
            <StatusBadge tone="info">{context.title}</StatusBadge>
          </div>
          <p className="mt-1 text-[13px] text-[var(--muted)] truncate">
            {context.description}
          </p>
        </div>
      </div>
      <div className="pointer-events-auto flex flex-1 items-center justify-end gap-3">
        <label className="hidden min-w-0 max-w-md flex-1 items-center gap-3 rounded-[1rem] border border-[var(--line-strong)] bg-white/55 px-3.5 py-2.5 md:flex">
          <Search className="size-4 text-[var(--muted)]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search systems, users or logs..."
            className="w-full min-w-0 border-0 bg-transparent p-0 text-[13px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          />
        </label>
        <button
          type="button"
          className="m3-icon-button"
          aria-label="Voir les notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="m3-icon-button"
          aria-label="Aide"
        >
          <HelpCircle className="size-4" aria-hidden="true" />
        </button>
        <Link
          href="/"
          className="m3-outline-button rounded-full px-4 py-2 text-[13px] font-semibold"
        >
          Retour acces
        </Link>
        {!isOverview ? (
          <Link
            href={context.navItems[0]?.href ?? '/'}
            className="m3-filled-button rounded-full px-4 py-2 text-[13px] font-semibold"
          >
            Dashboard
          </Link>
        ) : null}
      </div>
    </header>
  );
}
