"use client";

import Link from "next/link";
import { Clock, PanelLeftClose, PanelLeftOpen, Settings, Star } from "lucide-react";

import { DashboardSidebarCollections } from "@/components/dashboard/dashboard-sidebar-collections";
import { ItemTypeIcon } from "@/components/dashboard/item-type-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isProItemTypeId } from "@/lib/item-types";
import type { DashboardNavModel } from "@/lib/dashboard-nav";

export interface DashboardSidebarContentProps {
  nav: DashboardNavModel;
  collapsed: boolean;
  onNavigate?: () => void;
  className?: string;
  /** Desktop rail only: collapse/expand the sidebar width. */
  onToggleCollapse?: () => void;
  variant?: "desktop" | "drawer";
}

function SectionLabel({
  children,
  collapsed,
}: {
  children: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return (
      <div
        className="mt-4 mb-2 h-px w-full bg-sidebar-border first:mt-0"
        title={children}
        aria-hidden
      />
    );
  }
  return (
    <p className="mt-4 mb-2 px-2 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase first:mt-0">
      {children}
    </p>
  );
}

export function DashboardSidebarContent({
  nav,
  collapsed,
  onNavigate,
  className,
  onToggleCollapse,
  variant = "desktop",
}: DashboardSidebarContentProps) {
  const { itemTypes, collections } = nav;
  const showCollapseToggle = variant === "desktop" && onToggleCollapse;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {showCollapseToggle ? (
        <div
          className={cn(
            "flex shrink-0 items-center border-sidebar-border border-b py-2",
            collapsed ? "justify-center px-0" : "justify-end px-2",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5" aria-hidden />
            ) : (
              <PanelLeftClose className="size-5" aria-hidden />
            )}
          </Button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 py-3">
            <SectionLabel collapsed={collapsed}>Types</SectionLabel>
            <ul className="flex flex-col gap-0.5 px-1">
              {itemTypes.map((t) => {
                const row = (
                  <>
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card/40"
                      style={{ color: t.color }}
                    >
                      <ItemTypeIcon name={t.icon} className="size-4" />
                    </span>
                    {!collapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {t.pluralName}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          {isProItemTypeId(t.id) ? (
                            <span className="rounded border border-border px-1 py-px text-[0.6rem] text-muted-foreground">
                              PRO
                            </span>
                          ) : null}
                          <span className="tabular-nums text-muted-foreground text-xs">
                            {t.count}
                          </span>
                        </span>
                      </>
                    ) : null}
                  </>
                );

                const className = cn(
                  "flex items-center gap-2 rounded-md py-2 text-sm transition-colors",
                  collapsed ? "justify-center px-0" : "px-2",
                  t.isProLocked
                    ? "cursor-not-allowed text-muted-foreground opacity-70"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                );

                return (
                  <li key={t.id}>
                    {t.isProLocked ? (
                      <div
                        title={
                          collapsed
                            ? `${t.pluralName} (${t.count})`
                            : undefined
                        }
                        className={className}
                      >
                        {row}
                      </div>
                    ) : (
                      <Link
                        href={t.href}
                        title={
                          collapsed
                            ? `${t.pluralName} (${t.count})`
                            : undefined
                        }
                        onClick={onNavigate}
                        className={className}
                      >
                        {row}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <DashboardSidebarCollections
            collections={collections}
            itemTypes={itemTypes}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="mt-auto flex w-full shrink-0 flex-col border-sidebar-border border-t">
        <div
          className={cn(
            "flex flex-col gap-0.5 py-2",
            collapsed ? "px-1" : "px-2",
          )}
        >
          <Link
            href="/dashboard"
            title={collapsed ? "Favorites" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Star className="size-4 shrink-0" aria-hidden />
            {!collapsed ? <span>Favorites</span> : null}
          </Link>
          <Link
            href="/dashboard"
            title={collapsed ? "Recently used" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Clock className="size-4 shrink-0" aria-hidden />
            {!collapsed ? <span>Recently used</span> : null}
          </Link>
          <Link
            href="/settings"
            title={collapsed ? "Settings" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <Settings className="size-4 shrink-0" aria-hidden />
            {!collapsed ? <span>Settings</span> : null}
          </Link>
        </div>
      </div>
    </div>
  );
}
