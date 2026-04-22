import { prisma } from "@/lib/prisma";
import { resolveDashboardUserId } from "@/lib/db/collections";

export interface DashboardItemTypeRow {
  id: string;
  name: string;
  pluralName: string;
  icon: string;
  color: string;
  count: number;
  href: string;
}

function pluralizeTypeName(name: string) {
  // Current system types pluralize cleanly with "s" (Snippet → Snippets, etc.).
  return name.endsWith("s") ? name : `${name}s`;
}

export function itemTypeHref(typeNamePlural: string) {
  return `/items/${typeNamePlural.toLowerCase()}`;
}

export async function getDashboardItemTypes({
  userId,
}: {
  userId?: string;
} = {}): Promise<DashboardItemTypeRow[]> {
  const resolvedUserId = userId ?? (await resolveDashboardUserId());
  if (!resolvedUserId) return [];

  const [types, itemCounts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
    }),
    prisma.item.groupBy({
      by: ["itemTypeId"],
      where: { userId: resolvedUserId },
      _count: { _all: true },
    }),
  ]);

  const countsByTypeId = new Map<string, number>(
    itemCounts.map((r) => [r.itemTypeId, r._count._all]),
  );

  return types.map((t) => {
    const pluralName = pluralizeTypeName(t.name);
    return {
      id: t.id,
      name: t.name,
      pluralName,
      icon: t.icon,
      color: t.color,
      count: countsByTypeId.get(t.id) ?? 0,
      href: itemTypeHref(pluralName),
    };
  });
}

export async function getItemTypeBySlug({
  slug,
}: {
  slug: string;
}): Promise<DashboardItemTypeRow | null> {
  const decoded = decodeURIComponent(slug).toLowerCase();
  const types = await getDashboardItemTypes();
  return (
    types.find((t) => t.pluralName.toLowerCase() === decoded) ??
    types.find((t) => t.name.toLowerCase() === decoded) ??
    null
  );
}

