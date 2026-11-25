import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
}
