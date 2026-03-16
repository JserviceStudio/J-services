import { AppShell } from '@/components/ui/app-shell';
import { resellerShellContext } from '@/lib/workspaces';

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell context={resellerShellContext}>{children}</AppShell>;
}
