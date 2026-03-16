import { AppShell } from '@/components/ui/app-shell';
import { clientShellContext } from '@/lib/workspaces';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell context={clientShellContext}>{children}</AppShell>;
}
