import { prisma } from "@/lib/prisma";

export interface DashboardCollectionTypeSummary {
  itemTypeId: string;
  count: number;
}

export interface DashboardCollectionRow {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  itemCount: number;
  dominantItemTypeId: string | null;
  dominantLabel: string;
  types: DashboardCollectionTypeSummary[];
}

export async function resolveDashboardUserId() {
  const demo = await prisma.user.findUnique({
    where: { email: "demo@devloot.io" },
    select: { id: true },
  });
  if (demo) return demo.id;

  const first = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return first?.id ?? null;
}

export async function getRecentDashboardCollections({
  userId,
  take = 6,
}: {
  userId?: string;
  take?: number;
} = {}): Promise<DashboardCollectionRow[]> {
  const resolvedUserId = userId ?? (await resolveDashboardUserId());
  if (!resolvedUserId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId: resolvedUserId },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      updatedAt: true,
      _count: { select: { items: true } },
      items: {
        select: {
          item: {
            select: {
              itemTypeId: true,
            },
          },
        },
      },
    },
  });

  return collections.map((c) => {
    const typeCounts = new Map<string, number>();
    for (const link of c.items) {
      const typeId = link.item.itemTypeId;
      typeCounts.set(typeId, (typeCounts.get(typeId) ?? 0) + 1);
    }

    const types = [...typeCounts.entries()]
      .map(([itemTypeId, count]) => ({ itemTypeId, count }))
      .sort((a, b) => b.count - a.count);

    const dominant = types[0];
    const dominantItemTypeId = dominant?.itemTypeId ?? null;

    const dominantLabel =
      types.length === 0
        ? "—"
        : "mixed";

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      isFavorite: c.isFavorite,
      updatedAt: c.updatedAt,
      itemCount: c._count.items,
      dominantItemTypeId,
      dominantLabel,
      types,
    };
  });
}

export async function getDashboardStats({ userId }: { userId?: string } = {}) {
  const resolvedUserId = userId ?? (await resolveDashboardUserId());
  if (!resolvedUserId) {
    return {
      totalItems: 0,
      totalCollections: 0,
      favoriteItemsCount: 0,
      favoriteCollectionsCount: 0,
    };
  }

  const [totalItems, totalCollections, favoriteCollectionsCount] = await Promise.all([
    prisma.item.count({ where: { userId: resolvedUserId } }),
    prisma.collection.count({ where: { userId: resolvedUserId } }),
    prisma.collection.count({ where: { userId: resolvedUserId, isFavorite: true } }),
  ]);

  const favoriteCollectionIds = await prisma.collection.findMany({
    where: { userId: resolvedUserId, isFavorite: true },
    select: { id: true },
  });
  const favoriteItemsDistinct = await prisma.itemCollection.findMany({
    where: { collectionId: { in: favoriteCollectionIds.map((c) => c.id) } },
    distinct: ["itemId"],
    select: { itemId: true },
  });

  return {
    totalItems,
    totalCollections,
    favoriteItemsCount: favoriteItemsDistinct.length,
    favoriteCollectionsCount,
  };
}

export async function getDashboardGreeting({ userId }: { userId?: string } = {}) {
  const resolvedUserId = userId ?? (await resolveDashboardUserId());
  if (!resolvedUserId) return "Good day";

  const user = await prisma.user.findUnique({
    where: { id: resolvedUserId },
    select: { name: true },
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = user?.name ?? "there";
  return `${greeting}, ${name}`;
}

export async function getDashboardLastUsedTitle({
  userId,
}: {
  userId?: string;
} = {}) {
  const resolvedUserId = userId ?? (await resolveDashboardUserId());
  if (!resolvedUserId) return "—";

  const item = await prisma.item.findFirst({
    where: { userId: resolvedUserId },
    orderBy: { updatedAt: "desc" },
    select: { title: true },
  });
  return item?.title ?? "—";
}

