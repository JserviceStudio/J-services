import { Suspense } from 'react';
import { ClientShell } from '@/features/client/components/client-shell';

export default function ClientPage() {
  return (
    <Suspense fallback={<div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement de l’espace client...</div>}>
      <ClientShell />
    </Suspense>
  );
}
