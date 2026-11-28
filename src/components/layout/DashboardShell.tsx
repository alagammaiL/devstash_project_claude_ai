"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Code,
  ChevronDown,
  File,
  Folder,
  Image as ImageIcon,
  Link as LinkIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import type { DashboardCollection } from "@/lib/db/collections";
import type { DashboardItemType } from "@/lib/db/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProBadge } from "@/components/ui/pro-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { user } from "@/lib/mock-data";

const itemTypeIcons: Record<string, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  file: File,
  image: ImageIcon,
  link: LinkIcon,
};

const itemTypeLabels: Record<string, string> = {
  snippet: "Snippets",
  prompt: "Prompts",
  command: "Commands",
  note: "Notes",
  file: "Files",
  image: "Images",
  link: "Links",
};

const itemTypeOrder = new Map(
  ["command", "prompt", "snippet", "note", "link", "file", "image"].map(
    (id, index) => [id, index],
  ),
);

type SidebarNavigationProps = {
  collapsed: boolean;
  collections: DashboardCollection[];
  itemTypes: DashboardItemType[];
  onNavigate?: () => void;
};

function CollectionRow({
  collection,
  collapsed,
  isRecent,
}: {
  collection: DashboardCollection;
  collapsed: boolean;
  isRecent: boolean;
}) {
  return (
    <div
      className={`flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground ${
        collapsed ? "justify-center px-0" : ""
      }`}
      title={collapsed ? collection.name : undefined}
    >
      {isRecent ? (
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: collection.color }}
        />
      ) : (
        <Folder
          aria-hidden="true"
          className="size-4 shrink-0"
          style={{ color: collection.color }}
        />
      )}
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{collection.name}</span>
          {collection.isFavorite ? (
            <Star
              aria-label="Favorite"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            />
          ) : (
            <span className="text-xs">{collection.itemCount}</span>
          )}
        </>
      )}
    </div>
  );
}

function SidebarNavigation({
  collapsed,
  collections,
  itemTypes,
  onNavigate,
}: SidebarNavigationProps) {
  const [isFavoritesCollapsed, setIsFavoritesCollapsed] = useState(false);
  const favoriteCollections = collections.filter(
    (collection) => collection.isFavorite,
  );
  const recentCollections = collections.slice(0, 3);
  const orderedItemTypes = [...itemTypes].sort(
    (first, second) =>
      (itemTypeOrder.get(first.id) ?? itemTypeOrder.size) -
        (itemTypeOrder.get(second.id) ?? itemTypeOrder.size) ||
      first.name.localeCompare(second.name),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <nav aria-label="Item types" className="space-y-1 px-3 pt-4">
        {!collapsed && (
          <h2 className="px-3 pb-2 text-sm font-medium text-muted-foreground">
            Types
          </h2>
        )}
        {orderedItemTypes.map((itemType) => {
          const Icon = itemTypeIcons[itemType.id] ?? File;
          const label = itemTypeLabels[itemType.id] ?? itemType.name;

          return (
            <Link
              aria-label={label}
              className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm text-foreground transition-colors hover:bg-muted ${
                collapsed ? "justify-center px-0" : ""
              }`}
              href={`/items/${itemType.id}`}
              key={itemType.id}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
            >
              <Icon
                aria-hidden="true"
                className="size-4 shrink-0"
                style={{ color: itemType.color }}
              />
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">{label}</span>
                  {(itemType.id === "file" || itemType.id === "image") && (
                    <ProBadge />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {itemType.count}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 my-4 border-t border-border" />

      <section aria-label="Favorite collections" className="space-y-1 px-3">
        {!collapsed && (
          <Button
            aria-expanded={!isFavoritesCollapsed}
            className="h-8 w-full justify-between px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
            onClick={() => setIsFavoritesCollapsed(!isFavoritesCollapsed)}
            type="button"
            variant="ghost"
          >
            <span>Favorites</span>
            <ChevronDown
              aria-hidden="true"
              className={`size-3.5 transition-transform ${
                isFavoritesCollapsed ? "-rotate-90" : ""
              }`}
            />
          </Button>
        )}
        {(collapsed || !isFavoritesCollapsed) &&
          favoriteCollections.map((collection) => (
            <CollectionRow
              collapsed={collapsed}
              collection={collection}
              isRecent={false}
              key={collection.id}
            />
          ))}
      </section>

      <section
        aria-label="Most recent collections"
        className="mt-5 space-y-1 px-3 pb-4"
      >
        {!collapsed && (
          <h2 className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent Collections
          </h2>
        )}
        {recentCollections.map((collection) => (
          <CollectionRow
            collapsed={collapsed}
            collection={collection}
            isRecent={true}
            key={collection.id}
          />
        ))}
      </section>

      <div className="px-3 pb-4">
        <Link
          aria-label={collapsed ? "View all collections" : undefined}
          className={`flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted ${
            collapsed ? "justify-center px-0" : ""
          }`}
          href="/collections"
          onClick={onNavigate}
          title={collapsed ? "View all collections" : undefined}
        >
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          {!collapsed && <span>View all collections</span>}
        </Link>
      </div>

      <div
        className={`mt-auto border-t border-border p-4 ${
          collapsed ? "flex justify-center px-2" : ""
        }`}
      >
        <div
          className={`flex min-w-0 items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? `${user.name} — ${user.email}` : undefined}
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-sm font-medium text-foreground"
          >
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  children,
  collections,
  itemTypes,
}: {
  children: ReactNode;
  collections: DashboardCollection[];
  itemTypes: DashboardItemType[];
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="flex flex-col gap-4 border-b border-border px-4 py-4 md:flex-row md:items-center md:px-6 md:py-3">
        <div className="flex shrink-0 items-center gap-3 md:w-56">
          <Sheet onOpenChange={setIsMobileDrawerOpen} open={isMobileDrawerOpen}>
            <SheetTrigger
              render={
                <Button
                  aria-label="Open sidebar"
                  className="md:hidden"
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <PanelLeftOpen aria-hidden="true" />
            </SheetTrigger>
            <SheetContent className="w-72 gap-0 border-r p-0" side="left">
              <SheetHeader className="border-b border-border">
                <SheetTitle>Dashboard</SheetTitle>
              </SheetHeader>
              <SidebarNavigation
                collapsed={false}
                collections={collections}
                itemTypes={itemTypes}
                onNavigate={() => setIsMobileDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>

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

      <div
        className={`grid min-h-[calc(100vh-4.5rem)] grid-cols-1 ${
          isCollapsed
            ? "md:grid-cols-[5rem_minmax(0,1fr)]"
            : "md:grid-cols-[16rem_minmax(0,1fr)]"
        }`}
      >
        <aside className="hidden min-h-0 flex-col border-r border-border md:flex">
          <div
            className={`flex h-12 items-center border-b border-border p-3 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium">Dashboard</span>
            )}
            <Button
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isCollapsed ? (
                <PanelLeftOpen aria-hidden="true" />
              ) : (
                <PanelLeftClose aria-hidden="true" />
              )}
            </Button>
          </div>
          <SidebarNavigation
            collapsed={isCollapsed}
            collections={collections}
            itemTypes={itemTypes}
          />
        </aside>

        {children}
      </div>
    </div>
  );
}
