import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ClientStockRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Client operations"
      title="Stock"
      description="Vue dediee au stock et aux profils critiques, isolee du reste du dashboard client."
      points={['inventory table', 'profile filters', 'critical stock alerts']}
    />
  );
}
