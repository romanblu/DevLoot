import {
  getDashboardGreeting,
  getDashboardLastUsedTitle,
  getDashboardStats,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getDashboardItemTypes } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

function pluralizeTypeLabel(typeName: string) {
  return `${typeName.toLowerCase()}s`;
}

export async function getDashboardHomeData() {
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devloot.io" },
    select: { id: true },
  });
  const user =
    demoUser ??
    (await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    }));

  const [itemTypes, pinnedItemsRaw, recentItemsRaw] = await Promise.all([
    getDashboardItemTypes({ userId: user?.id }),
    prisma.item.findMany({
      where: { userId: user?.id, isPinned: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        itemTypeId: true,
        tags: { select: { name: true } },
        collections: { select: { collectionId: true } },
      },
    }),
    prisma.item.findMany({
      where: { userId: user?.id, isPinned: false },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        itemTypeId: true,
        tags: { select: { name: true } },
        collections: { select: { collectionId: true } },
      },
    }),
  ]);

  const itemTypeById = new Map(itemTypes.map((t) => [t.id, t]));

  const [greeting, stats, recentCollectionsRaw, lastUsedTitle] =
    await Promise.all([
      getDashboardGreeting({ userId: user?.id }),
      getDashboardStats({ userId: user?.id }),
      getRecentDashboardCollections({ userId: user?.id }),
      getDashboardLastUsedTitle({ userId: user?.id }),
    ]);

  const recentCollections = recentCollectionsRaw.map((c) => {
    const dominantType = c.dominantItemTypeId
      ? itemTypeById.get(c.dominantItemTypeId)
      : undefined;

    const dominantLabel =
      c.types.length === 0
        ? "—"
        : c.types.length === 1 && dominantType
          ? pluralizeTypeLabel(dominantType.name)
          : "mixed";

    return {
      ...c,
      dominantLabel,
    };
  });

  const pinnedItems = pinnedItemsRaw.map((i) => ({
    id: i.id,
    title: i.title,
    isPinned: i.isPinned,
    itemTypeId: i.itemTypeId,
    contentPreview: i.content ? i.content.slice(0, 140) : "",
    tags: i.tags.map((t) => t.name),
    collectionIds: i.collections.map((c) => c.collectionId),
  }));

  const recentItems = recentItemsRaw.map((i) => ({
    id: i.id,
    title: i.title,
    isPinned: i.isPinned,
    itemTypeId: i.itemTypeId,
    contentPreview: i.content ? i.content.slice(0, 140) : "",
    tags: i.tags.map((t) => t.name),
    collectionIds: i.collections.map((c) => c.collectionId),
  }));

  return {
    greeting,
    stats,
    summaryLine: `${stats.totalItems} items · ${stats.totalCollections} collections · last used: ${lastUsedTitle}`,
    recentCollections,
    pinnedItems,
    recentItems,
    itemTypeById,
  };
}

export type DashboardHomeData = Awaited<ReturnType<typeof getDashboardHomeData>>;
export type DashboardHomeItem = DashboardHomeData["recentItems"][number];
export type DashboardHomeCollection = DashboardHomeData["recentCollections"][number];
