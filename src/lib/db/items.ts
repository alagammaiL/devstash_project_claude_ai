import "server-only";

import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";
const RECENT_ITEM_LIMIT = 10;

const dashboardItemSelect = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  type: {
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  tags: string[];
}

export interface DashboardItems {
  pinnedItems: DashboardItem[];
  recentItems: DashboardItem[];
  totalItemCount: number;
  favoriteItemCount: number;
}

export interface DashboardItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

async function getDashboardUserId(): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  if (!user) {
    throw new Error(
      `No dashboard user found for ${DEMO_USER_EMAIL}; run the development seed.`,
    );
  }

  return user.id;
}

export async function getDashboardItems(): Promise<DashboardItems> {
  const userId = await getDashboardUserId();

  const [pinnedItems, recentItems, totalItemCount, favoriteItemCount] =
    await Promise.all([
      prisma.item.findMany({
        where: { userId, isPinned: true },
        select: dashboardItemSelect,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.item.findMany({
        where: { userId },
        select: dashboardItemSelect,
        orderBy: { updatedAt: "desc" },
        take: RECENT_ITEM_LIMIT,
      }),
      prisma.item.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
    ]);

  const mapItems = (items: typeof pinnedItems): DashboardItem[] =>
    items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      isFavorite: item.isFavorite,
      isPinned: item.isPinned,
      updatedAt: item.updatedAt,
      type: item.type,
      tags: item.tags.map(({ tag }) => tag.name),
    }));

  return {
    pinnedItems: mapItems(pinnedItems),
    recentItems: mapItems(recentItems),
    totalItemCount,
    favoriteItemCount,
  };
}

export async function getDashboardItemTypes(): Promise<DashboardItemType[]> {
  const userId = await getDashboardUserId();
  const [itemTypes, itemCounts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.item.groupBy({
      by: ["typeId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);
  const countByTypeId = new Map(
    itemCounts.map(({ typeId, _count }) => [typeId, _count._all]),
  );

  return itemTypes.map((itemType) => ({
    ...itemType,
    count: countByTypeId.get(itemType.id) ?? 0,
  }));
}
