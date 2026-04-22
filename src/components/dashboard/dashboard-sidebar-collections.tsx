"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DashboardNavModel } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

type CollectionRow = DashboardNavModel["collections"][number];
type ItemTypeRow = DashboardNavModel["itemTypes"][number];

function folderColor(collection: CollectionRow, itemTypes: ItemTypeRow[]) {
  const t = itemTypes.find((it) => it.id === collection.dominantItemTypeId);
  return t?.color ?? "#6b7280";
}

function CollectionLinks({
  collections,
  itemTypes,
  onNavigate,
  onPick,
  className,
}: {
  collections: CollectionRow[];
  itemTypes: ItemTypeRow[];
  onNavigate?: () => void;
  onPick?: () => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-0.5 px-0", className)}>
      {collections.map((c) => {
        const color = folderColor(c, itemTypes);
        return (
          <li key={c.id}>
            <Link
              href={`/collections/${c.id}`}
              onClick={() => {
                onPick?.();
                onNavigate?.();
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate font-medium">
                {c.name}
              </span>
              {c.isFavorite ? (
                <Star
                  className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                  aria-label="Favorite collection"
                />
              ) : null}
              <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                {c.itemCount}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardSidebarCollections({
  collections,
  itemTypes,
  collapsed,
  onNavigate,
}: {
  collections: CollectionRow[];
  itemTypes: ItemTypeRow[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [listOpen, setListOpen] = useState(true);

  const toggleLabel = listOpen ? "Hide collections" : "Show collections";

  if (collapsed) {
    return (
      <div className="relative mt-4 flex shrink-0 justify-center px-1 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
          aria-label={toggleLabel}
          aria-expanded={listOpen}
          onClick={() => setListOpen((o) => !o)}
        >
          <span className="size-5 rounded-md border border-border/60 bg-card/40" aria-hidden />
        </Button>
        {listOpen ? (
          <div
            role="region"
            aria-label="Collections"
            className={cn(
              "absolute top-1/2 left-full z-50 ml-1 w-56 max-h-[min(70vh,22rem)] -translate-y-1/2 overflow-y-auto rounded-md border border-sidebar-border bg-sidebar py-2 pr-1 pl-2 shadow-lg",
            )}
          >
            <CollectionLinks
              collections={collections}
              itemTypes={itemTypes}
              onNavigate={onNavigate}
              onPick={() => setListOpen(false)}
            />
            <div className="mt-1 px-2 pr-3">
              <Link
                href="/collections"
                onClick={() => {
                  setListOpen(false);
                  onNavigate?.();
                }}
                className="block rounded-md px-2 py-2 text-muted-foreground text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                View all collections
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 shrink-0 px-2 pb-2">
      <div className="mb-2 flex items-center justify-between gap-1">
        <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
          Collections
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 shrink-0 text-muted-foreground"
          aria-label={toggleLabel}
          aria-expanded={listOpen}
          onClick={() => setListOpen((o) => !o)}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              listOpen ? "rotate-180" : "rotate-0",
            )}
            aria-hidden
          />
        </Button>
      </div>
      {listOpen ? (
        <div role="region" aria-label="Collections">
          <CollectionLinks
            collections={collections}
            itemTypes={itemTypes}
            onNavigate={onNavigate}
          />
          <div className="mt-1">
            <Link
              href="/collections"
              onClick={onNavigate}
              className="block rounded-md px-2 py-2 text-muted-foreground text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              View all collections
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
