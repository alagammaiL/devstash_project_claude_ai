import {
  Code,
  File,
  Folder,
  Image as ImageIcon,
  Link as LinkIcon,
  Pin,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { collections, itemTypes, items } from "@/lib/mock-data";

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
  snippet: "Snippet",
  prompt: "Prompt",
  command: "Command",
  note: "Note",
  file: "File",
  image: "Image",
  link: "Link",
};

const numberFormatter = new Intl.NumberFormat("en-US");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function ItemTypeIcon({
  typeId,
  className,
}: {
  typeId: string;
  className: string;
}) {
  const Icon = itemTypeIcons[typeId] ?? File;
  const color = itemTypes.find((itemType) => itemType.name === typeId)?.color;

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-muted ${className}`}
      style={{ color }}
    >
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}

export default function DashboardContent() {
  const favoriteItems = items.filter((item) => item.isFavorite);
  const favoriteCollections = collections.filter(
    (collection) => collection.isFavorite,
  );
  const pinnedItems = items.filter((item) => item.isPinned);
  const recentItems = [...items]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime(),
    )
    .slice(0, 10);
  const totalItemCount = itemTypes.reduce(
    (total, itemType) => total + itemType.count,
    0,
  );

  const stats = [
    {
      label: "Total items",
      value: totalItemCount,
      detail: "Across all item types",
      Icon: Code,
      color: "#3b82f6",
    },
    {
      label: "Collections",
      value: collections.length,
      detail: "Organized for quick access",
      Icon: Folder,
      color: "#8b5cf6",
    },
    {
      label: "Favorite items",
      value: favoriteItems.length,
      detail: "Items marked as favorites",
      Icon: Star,
      color: "#f59e0b",
    },
    {
      label: "Favorite collections",
      value: favoriteCollections.length,
      detail: "Collections marked as favorites",
      Icon: Folder,
      color: "#ec4899",
    },
  ];

  return (
    <main className="min-w-0 space-y-8 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your developer knowledge hub
        </p>
      </header>

      <section aria-label="Dashboard statistics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, detail, Icon, color }) => (
            <article
              className="rounded-xl border border-border bg-card/60 p-4 sm:p-5"
              key={label}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {numberFormatter.format(value)}
                  </p>
                </div>
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted"
                  style={{ color }}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="collections-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              className="text-lg font-semibold tracking-tight"
              id="collections-heading"
            >
              Collections
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick up where you left off
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {collections.length} collections
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {collections.map((collection) => (
            <article
              className="min-w-0 rounded-xl border border-border border-l-2 bg-card/60 p-4 transition-colors hover:bg-accent/40 sm:p-5"
              key={collection.id}
              style={{ borderLeftColor: collection.color }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{collection.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {collection.itemCount} items
                  </p>
                </div>
                {collection.isFavorite && (
                  <Star
                    aria-label="Favorite collection"
                    className="mt-0.5 size-4 shrink-0 fill-amber-400 text-amber-400"
                  />
                )}
              </div>
              <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                {collection.description}
              </p>
              <div
                aria-label="Collection item types"
                className="mt-3 flex items-center gap-2"
              >
                {collection.itemTypeIds.map((typeId) => {
                  const Icon = itemTypeIcons[typeId] ?? File;
                  const type = itemTypes.find(
                    (itemType) => itemType.name === typeId,
                  );

                  return (
                    <Icon
                      aria-label={type?.name ?? typeId}
                      className="size-4"
                      key={typeId}
                      style={{ color: type?.color }}
                    />
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="pinned-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Pin aria-hidden="true" className="size-4 text-muted-foreground" />
          <h2
            className="text-lg font-semibold tracking-tight"
            id="pinned-heading"
          >
            Pinned items
          </h2>
        </div>
        {pinnedItems.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {pinnedItems.map((item) => (
              <article
                className="flex min-w-0 gap-4 rounded-xl border border-border border-l-2 bg-card/60 p-4 sm:p-5"
                key={item.id}
                style={{
                  borderLeftColor: itemTypes.find(
                    (itemType) => itemType.name === item.typeId,
                  )?.color,
                }}
              >
                <ItemTypeIcon
                  className="size-11"
                  typeId={item.typeId}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-medium">{item.title}</h3>
                    <Pin
                      aria-label="Pinned"
                      className="size-3.5 shrink-0 fill-current text-muted-foreground"
                    />
                    {item.isFavorite && (
                      <Star
                        aria-label="Favorite"
                        className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                      />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Pin items to keep them close at hand.
          </p>
        )}
      </section>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              className="text-lg font-semibold tracking-tight"
              id="recent-heading"
            >
              Recent items
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest additions and updates
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Showing {recentItems.length}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card/40">
          {recentItems.map((item, index) => {
            const type = itemTypes.find(
              (itemType) => itemType.name === item.typeId,
            );

            return (
              <article
                className={`flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                  index > 0 ? "border-t border-border" : ""
                }`}
                key={item.id}
              >
                <ItemTypeIcon className="size-10" typeId={item.typeId} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {itemTypeLabels[item.typeId] ?? type?.name ?? "Item"}
                    </span>
                    {item.isPinned && (
                      <Pin
                        aria-label="Pinned"
                        className="size-3.5 fill-current text-muted-foreground"
                      />
                    )}
                    {item.isFavorite && (
                      <Star
                        aria-label="Favorite"
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <time
                  className="shrink-0 text-xs text-muted-foreground sm:pl-3"
                  dateTime={item.updatedAt}
                >
                  {formatDate(item.updatedAt)}
                </time>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
