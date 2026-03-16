import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ResellerCommissionsRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Reseller sales"
      title="Commissions"
      description="Page reservee a l’analyse des commissions et a leur evolution dans le temps."
      points={['commissions chart', 'average ticket', 'top products']}
    />
  );
}
