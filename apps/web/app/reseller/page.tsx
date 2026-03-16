import { Suspense } from 'react';
import { ResellerShell } from '@/features/reseller/components/reseller-shell';

export default function ResellerPage() {
  return (
    <Suspense fallback={<div className="card-neutral rounded-[1.5rem] p-6 text-[13px] text-[var(--muted)]">Chargement de l’espace reseller...</div>}>
      <ResellerShell />
    </Suspense>
  );
}
