import { AppShell } from '@/components/ui/app-shell';
import { adminShellContext } from '@/lib/workspaces';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell context={adminShellContext}>{children}</AppShell>;
}
