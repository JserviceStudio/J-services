import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ResellerSalesRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Reseller sales"
      title="Sales"
      description="Vue dediee aux ventes reseller, detachee du cockpit global."
      points={['transaction table', 'window filters', 'sale kind breakdown']}
    />
  );
}
