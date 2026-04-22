import Link from "next/link";
import { Star } from "lucide-react";

import { ItemTypeIcon } from "@/components/dashboard/item-type-icon";
import type {
  DashboardHomeCollection,
  DashboardHomeData,
  DashboardHomeItem,
} from "@/lib/dashboard-home";
import { getDashboardHomeData } from "@/lib/dashboard-home";
import { cn } from "@/lib/utils";

type ItemType = DashboardHomeData["itemTypeById"] extends Map<string, infer V>
  ? V
  : never;

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="mt-1 font-semibold text-2xl tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}

function CollectionCard({
  collection,
  dominant,
  itemTypeById,
}: {
  collection: DashboardHomeCollection;
  dominant: ItemType | undefined;
  itemTypeById: DashboardHomeData["itemTypeById"];
}) {
  const accent = dominant?.color ?? "#6b7280";

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "group flex min-h-[7.5rem] flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors",
        "hover:border-primary/40 hover:bg-card/80",
      )}
    >
      <div
        className="mb-3 h-1 w-10 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className="mt-0.5 size-3.5 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <div className="flex items-center gap-2">
          {collection.types.length ? (
            <div className="flex items-center -space-x-1.5">
              {collection.types.map((t) => {
                const type = itemTypeById.get(t.itemTypeId);
                if (!type) return null;
                return (
                  <span
                    key={t.itemTypeId}
                    className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-card/60 shadow-sm"
                    style={{ color: type.color }}
                    title={`${type.name} (${t.count})`}
                  >
                    <ItemTypeIcon name={type.icon} className="size-3.5" />
                  </span>
                );
              })}
            </div>
          ) : null}
          {collection.isFavorite ? (
            <Star
              className="size-4 shrink-0 fill-amber-400 text-amber-400"
              aria-label="Favorite collection"
            />
          ) : null}
        </div>
      </div>
      <p className="mt-2 font-semibold text-foreground leading-snug">
        {collection.name}
      </p>
      <p className="mt-auto pt-2 text-muted-foreground text-xs">
        {collection.itemCount} items · {collection.dominantLabel}
      </p>
    </Link>
  );
}

function ItemCard({
  item,
  itemType,
  showPinnedStar,
}: {
  item: DashboardHomeItem;
  itemType: ItemType | undefined;
  showPinnedStar?: boolean;
}) {
  const accent = itemType?.color ?? "#6b7280";
  const typeLabel = itemType?.name.toLowerCase() ?? "item";
  const primaryHref =
    item.collectionIds[0] != null
      ? `/collections/${item.collectionIds[0]}`
      : `/items/${(itemType?.pluralName ?? "snippets").toLowerCase()}`;

  return (
    <Link
      href={primaryHref}
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors",
        "hover:border-primary/40 hover:bg-card/80",
      )}
    >
      <div
        className="mb-3 h-0.5 w-full rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-md border border-border px-1.5 py-0.5 font-medium text-[0.65rem] uppercase"
          style={{ color: accent, borderColor: `${accent}55` }}
        >
          {typeLabel}
        </span>
        {showPinnedStar && item.isPinned ? (
          <Star
            className="size-4 shrink-0 fill-amber-400 text-amber-400"
            aria-label="Pinned"
          />
        ) : null}
      </div>
      <p className="mt-2 font-semibold text-foreground leading-snug">
        {item.title}
      </p>
      <p className="mt-2 line-clamp-2 font-mono text-muted-foreground text-xs leading-relaxed">
        {item.contentPreview}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-[0.65rem]"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export async function DashboardHomeView() {
  const data = await getDashboardHomeData();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="space-y-1">
        <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
          {data.greeting}
        </h1>
        <p className="text-muted-foreground text-sm">{data.summaryLine}</p>
      </header>

      <section aria-labelledby="dashboard-stats-heading">
        <h2 id="dashboard-stats-heading" className="sr-only">
          Overview stats
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard label="Items" value={data.stats.totalItems} />
          <StatCard label="Collections" value={data.stats.totalCollections} />
          <StatCard
            label="Favorite items"
            value={data.stats.favoriteItemsCount}
          />
          <StatCard
            label="Favorite collections"
            value={data.stats.favoriteCollectionsCount}
          />
        </div>
      </section>

      <section aria-labelledby="recent-collections-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="recent-collections-heading"
            className="font-semibold text-lg tracking-tight"
          >
            Collections
          </h2>
          <span className="text-muted-foreground text-sm">View all</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {data.recentCollections.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              dominant={
                c.dominantItemTypeId
                  ? data.itemTypeById.get(c.dominantItemTypeId)
                  : undefined
              }
              itemTypeById={data.itemTypeById}
            />
          ))}
          <div
            className="flex min-h-[7.5rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center text-muted-foreground text-sm"
            aria-hidden
          >
            + New collection
          </div>
        </div>
      </section>

      <section aria-labelledby="pinned-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="pinned-heading"
            className="font-semibold text-lg tracking-tight"
          >
            Pinned
          </h2>
          <Link
            href="/dashboard"
            className="text-muted-foreground text-sm hover:text-foreground hover:underline"
          >
            See all items
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.pinnedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              itemType={data.itemTypeById.get(item.itemTypeId)}
              showPinnedStar
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-items-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="recent-items-heading"
            className="font-semibold text-lg tracking-tight"
          >
            Recent items
          </h2>
          <Link
            href="/dashboard"
            className="text-muted-foreground text-sm hover:text-foreground hover:underline"
          >
            See all items
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              itemType={data.itemTypeById.get(item.itemTypeId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
