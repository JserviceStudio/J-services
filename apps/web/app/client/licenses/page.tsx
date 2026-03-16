import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ClientLicensesRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Client operations"
      title="Licenses"
      description="Page dediee aux licences client, separee du dashboard operationnel."
      points={['license lifecycle', 'expiry alerts', 'plan details']}
    />
  );
}
