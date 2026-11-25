import "server-only";

import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";
const COLLECTION_LIMIT = 6;
const DEFAULT_COLLECTION_COLOR = "#6b7280";

interface CollectionItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  color: string;
  itemTypes: CollectionItemType[];
}

export async function getDashboardCollections(): Promise<
  DashboardCollection[]
> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  if (!user) {
    throw new Error(
      `No dashboard user found for ${DEMO_USER_EMAIL}; run the development seed.`,
    );
  }

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: {
          item: {
            select: {
              updatedAt: true,
              type: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  color: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const recentCollections = collections.map((collection) => {
    const itemTypeCounts = new Map<
      string,
      { itemType: CollectionItemType; count: number }
    >();
    let latestActivity = 0;

    for (const { item } of collection.items) {
      latestActivity = Math.max(latestActivity, item.updatedAt.getTime());
      const current = itemTypeCounts.get(item.type.id);
      itemTypeCounts.set(item.type.id, {
        itemType: item.type,
        count: (current?.count ?? 0) + 1,
      });
    }

    const itemTypes = [...itemTypeCounts.values()]
      .sort(
        (first, second) =>
          second.count - first.count ||
          first.itemType.name.localeCompare(second.itemType.name),
      )
      .map(({ itemType }) => itemType);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      color: itemTypes[0]?.color ?? DEFAULT_COLLECTION_COLOR,
      itemTypes,
      latestActivity,
    };
  });

  return recentCollections
    .sort(
      (first, second) =>
        second.latestActivity - first.latestActivity ||
        first.name.localeCompare(second.name),
    )
    .slice(0, COLLECTION_LIMIT)
    .map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.itemCount,
      color: collection.color,
      itemTypes: collection.itemTypes,
    }));
}
