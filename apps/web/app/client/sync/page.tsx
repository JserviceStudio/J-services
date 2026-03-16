import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ClientSyncRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Client operations"
      title="Sync"
      description="Suivi du pipeline de synchronisation entre la source de stock et le workspace client."
      points={['sync jobs', 'errors', 'batch history']}
    />
  );
}
