import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';

export function WorkspacePlaceholder({
  kicker,
  title,
  description,
  points,
}: {
  kicker: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <section className="space-y-5">
      <SectionHeader kicker={kicker} title={title} description={description} badge="Structured route" />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="card-neutral rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
          <p className="m3-label">Workspace section</p>
          <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.045em] text-[var(--foreground)]">
            Cette page a maintenant sa propre route.
          </h3>
          <p className="mt-2.5 text-[14px] leading-6 text-[var(--muted)]">
            Le shell, la navigation et l’URL sont en place. La prochaine passe branchera les
            tableaux et actions metier specifiques a cette section.
          </p>
        </div>
        <div className="card-admin rounded-[1.5rem] p-6 shadow-[var(--shadow-card)]">
          <p className="m3-label">Next wiring</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {points.map((point) => (
              <StatusBadge key={point} tone="info">
                {point}
              </StatusBadge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
