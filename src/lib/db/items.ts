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

export async function getDashboardItems(): Promise<DashboardItems> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  if (!user) {
    throw new Error(
      `No dashboard user found for ${DEMO_USER_EMAIL}; run the development seed.`,
    );
  }

  const [pinnedItems, recentItems, totalItemCount, favoriteItemCount] =
    await Promise.all([
      prisma.item.findMany({
        where: { userId: user.id, isPinned: true },
        select: dashboardItemSelect,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.item.findMany({
        where: { userId: user.id },
        select: dashboardItemSelect,
        orderBy: { updatedAt: "desc" },
        take: RECENT_ITEM_LIMIT,
      }),
      prisma.item.count({ where: { userId: user.id } }),
      prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
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
