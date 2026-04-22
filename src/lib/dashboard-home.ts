import { mockItemTypes, mockItems } from "@/lib/mock-data";
import {
  getDashboardGreeting,
  getDashboardLastUsedTitle,
  getDashboardStats,
  getRecentDashboardCollections,
} from "@/lib/db/collections";

function pluralizeTypeLabel(typeName: string) {
  return `${typeName.toLowerCase()}s`;
}

export async function getDashboardHomeData() {
  const pinnedItems = mockItems.filter((i) => i.isPinned);
  const recentItems = [...mockItems]
    .filter((i) => !i.isPinned)
    .reverse()
    .slice(0, 10);

  const itemTypeById = new Map(mockItemTypes.map((t) => [t.id, t]));

  const [greeting, stats, recentCollectionsRaw, lastUsedTitle] =
    await Promise.all([
      getDashboardGreeting(),
      getDashboardStats(),
      getRecentDashboardCollections(),
      getDashboardLastUsedTitle(),
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
