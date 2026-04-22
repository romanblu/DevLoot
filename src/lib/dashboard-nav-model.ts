import "server-only";

import { getRecentDashboardCollections } from "@/lib/db/collections";
import { getDashboardItemTypes } from "@/lib/db/items";
import type { DashboardNavModel } from "@/lib/dashboard-nav.types";
import { isProItemTypeId } from "@/lib/item-types";
import { prisma } from "@/lib/prisma";

export async function getDashboardNavModel(): Promise<DashboardNavModel> {
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devloot.io" },
    select: { id: true, name: true, email: true, image: true, isPro: true },
  });

  const user =
    demoUser ??
    (await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, image: true, isPro: true },
    }));

  const itemTypes = await getDashboardItemTypes({ userId: user?.id });
  const collections = await getRecentDashboardCollections({
    userId: user?.id,
    take: 50,
  });

  return {
    user: {
      id: user?.id ?? "unknown",
      name: user?.name ?? "Demo",
      initials: (user?.name ?? "Demo")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join(""),
      email: user?.email ?? "demo@devloot.io",
      image: user?.image ?? null,
      isPro: user?.isPro ?? true,
    },
    itemTypes: itemTypes.map((t) => ({
      ...t,
      isProLocked: isProItemTypeId(t.id) && !(user?.isPro ?? true),
    })),
    collections: [...collections].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

