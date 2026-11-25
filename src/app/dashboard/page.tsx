import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { getDashboardCollections } from "@/lib/db/collections";
import { getDashboardItemTypes } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [collections, itemTypes] = await Promise.all([
    getDashboardCollections(),
    getDashboardItemTypes(),
  ]);

  return (
    <DashboardShell collections={collections} itemTypes={itemTypes}>
      <DashboardContent collections={collections} />
    </DashboardShell>
  );
}
