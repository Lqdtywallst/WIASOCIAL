import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/layout/Providers";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthGuard>
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </Providers>
  );
}
