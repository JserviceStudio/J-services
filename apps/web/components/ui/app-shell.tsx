'use client';

import { Sidebar, type ShellNavItem } from '@/components/ui/sidebar';
import { Topbar } from '@/components/ui/topbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

export type ShellContext = {
  area: string;
  title: string;
  description: string;
  navItems: ShellNavItem[];
};

export function AppShell({
  children,
  context,
}: {
  children: React.ReactNode;
  context: ShellContext;
}) {
  const pathname = usePathname();
  const overviewHref = context.navItems[0]?.href;

  return (
    <div className="shell-grid">
      <a href="#workspace-content" className="skip-link">
        Aller au contenu
      </a>
      <Sidebar context={context} />
      <div className="px-4 py-4 md:px-5 md:py-5">
        <Topbar context={context} />
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Navigation workspace">
          {context.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'm3-outline-button shrink-0 rounded-[1rem] px-3.5 py-2.5 text-[12px] font-semibold transition',
                (pathname === item.href || (item.href !== overviewHref && pathname.startsWith(`${item.href}/`)))
                && 'bg-[var(--primary-soft)] text-[var(--primary-strong)] border-[var(--line-strong)]',
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main id="workspace-content" className="mt-4">{children}</main>
      </div>
    </div>
  );
}
