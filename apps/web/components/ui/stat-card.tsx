import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  hint,
  tone = 'neutral',
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: 'neutral' | 'public' | 'admin' | 'partner' | 'manager';
  icon?: LucideIcon;
}) {
  return (
    <article
      className={cn(
        'rounded-[1.65rem] p-5 shadow-[var(--shadow-card)]',
        tone === 'public' && 'card-public',
        tone === 'admin' && 'card-admin',
        tone === 'partner' && 'card-partner',
        tone === 'manager' && 'card-manager',
        tone === 'neutral' && 'card-neutral',
      )}
    >
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <span className="flex size-10 items-center justify-center rounded-[1rem] border border-[var(--line-strong)] bg-white/75 text-[var(--primary)]">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <p className="m3-label">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[2.05rem] font-black tracking-[-0.05em] text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] leading-6 text-[var(--muted)]">{hint}</p>
    </article>
  );
}
