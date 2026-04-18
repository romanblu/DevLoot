import {
  mockCollections,
  mockCurrentUser,
  mockItemTypes,
  mockItems,
} from "@/lib/mock-data";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDashboardHomeData() {
  const hour = new Date().getHours();
  const greeting = `${greetingForHour(hour)}, ${mockCurrentUser.name}`;

  const totalItems = mockItems.length;
  const totalCollections = mockCollections.length;
  const favoriteCollectionsCount = mockCollections.filter(
    (c) => c.isFavorite,
  ).length;

  const favoriteCollectionIds = new Set(
    mockCollections.filter((c) => c.isFavorite).map((c) => c.id),
  );
  const favoriteItemIds = new Set<string>();
  for (const item of mockItems) {
    if (item.collectionIds.some((id) => favoriteCollectionIds.has(id))) {
      favoriteItemIds.add(item.id);
    }
  }
  const favoriteItemsCount = favoriteItemIds.size;

  const recentCollections = [...mockCollections].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const pinnedItems = mockItems.filter((i) => i.isPinned);
  const recentItems = [...mockItems]
    .filter((i) => !i.isPinned)
    .reverse()
    .slice(0, 10);

  const itemTypeById = new Map(mockItemTypes.map((t) => [t.id, t]));

  const lastUsedTitle =
    recentItems[0]?.title ?? pinnedItems[0]?.title ?? "—";

  return {
    greeting,
    stats: {
      totalItems,
      totalCollections,
      favoriteItemsCount,
      favoriteCollectionsCount,
    },
    summaryLine: `${totalItems} items · ${totalCollections} collections · last used: ${lastUsedTitle}`,
    recentCollections,
    pinnedItems,
    recentItems,
    itemTypeById,
  };
}

export type DashboardHomeData = ReturnType<typeof getDashboardHomeData>;
export type DashboardHomeItem = DashboardHomeData["recentItems"][number];
export type DashboardHomeCollection = DashboardHomeData["recentCollections"][number];
