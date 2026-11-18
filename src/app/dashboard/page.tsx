import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <header className="flex flex-col gap-4 border-b border-border px-4 py-4 md:flex-row md:items-center md:px-6 md:py-3">
        <div className="flex shrink-0 items-center gap-3 md:w-56">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
            DS
          </span>
          <span className="text-xl font-semibold tracking-tight">DevStash</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full max-w-md md:mr-auto">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search items"
              className="h-10 pl-9"
              placeholder="Search items..."
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button className="h-10 gap-2" type="button">
              <Plus aria-hidden="true" />
              <span>Add Item</span>
            </Button>
            <Button className="h-10 gap-2" type="button" variant="outline">
              <Plus aria-hidden="true" />
              <span>Add Feature</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="border-b border-border p-6 md:border-b-0 md:border-r">
          <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
        </aside>
        <main className="p-6">
          <h2 className="text-2xl font-semibold">Main</h2>
        </main>
      </div>
    </div>
  );
}
