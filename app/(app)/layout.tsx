import { AppShellClient } from '@/components/AppShell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShellClient>{children}</AppShellClient>
}
