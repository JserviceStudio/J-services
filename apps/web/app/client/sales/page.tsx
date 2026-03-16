import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ClientSalesRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Client operations"
      title="Sales"
      description="Page reservee au suivi des ventes client et aux futurs indicateurs commerciaux."
      points={['sales feed', 'daily revenue', 'product attribution']}
    />
  );
}
