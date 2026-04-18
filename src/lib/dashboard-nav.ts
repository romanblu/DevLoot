import {
  mockCollections,
  mockCurrentUser,
  mockItemTypes,
  mockItems,
} from "@/lib/mock-data";

export function getItemTypeCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of mockItems) {
    counts.set(item.itemTypeId, (counts.get(item.itemTypeId) ?? 0) + 1);
  }
  return counts;
}

export function itemTypeHref(pluralName: string) {
  return `/items/${pluralName.toLowerCase()}`;
}

export function isProItemTypeId(id: string) {
  return id === "it_file" || id === "it_image";
}

export function getDashboardNavModel() {
  const counts = getItemTypeCounts();
  return {
    user: mockCurrentUser,
    itemTypes: mockItemTypes.map((t) => ({
      ...t,
      href: itemTypeHref(t.pluralName),
      count: counts.get(t.id) ?? 0,
      isProLocked: isProItemTypeId(t.id) && !mockCurrentUser.isPro,
    })),
    collections: [...mockCollections].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  };
}

export type DashboardNavModel = ReturnType<typeof getDashboardNavModel>;
